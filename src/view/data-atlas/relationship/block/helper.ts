import { useCallback, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { service } from "@service/api/data-atlas";
import { useDomainId } from "@config/app";
import { useRootDir, useTemplateType } from "../../context";
import { kmDebug } from "@common/misc";
import type { KeyOfFetcher } from "@service/api";

type Params = KeyOfFetcher<typeof service.dataassetmanager.getTableModelInfoByDirIdAndBeginIndex>["args"]["params"];

export const pageSize = 24;
export const rowHeight = 165;
export function useHelper() {
  const env = useDomainId();

  const rootDir = useRootDir();
  const templateType = useTemplateType();

  const qc = useQueryClient();

  const getTableModelKey = useMemo(
    () => ["getTableModelInfoByDirIdAndBeginIndex", { env, templateType, dirId: rootDir?.dirId }] as const,
    [env, templateType, rootDir?.dirId]
  );

  useEffect(() => {
    qc.setQueryData(getTableModelKey, { pages: [], pageParams: [] });
  }, [getTableModelKey, qc]); // 清oldPages, 防止重新请求之前[...页码]

  const {
    data: modelsData,
    // error: qrErr,
    fetchNextPage,
    hasNextPage,
    isFetching,
    // isFetchingNextPage,
    // status,
  } = useInfiniteQuery({
    queryKey: getTableModelKey,
    queryFn: async ({ queryKey, pageParam }) => {
      return service.dataassetmanager.getTableModelInfoByDirIdAndBeginIndex({
        url: queryKey[0],
        args: { params: Object.assign({ beginIndex: pageParam * pageSize, topNum: pageSize }, queryKey[1]) as Params },
      });
    },
    initialPageParam: 0, // 初始页码
    getNextPageParam: (lastPage, pages) => {
      const pageNum = lastPage && lastPage.length < pageSize ? undefined : pages.length;
      console.debug("getNextPageParam", lastPage?.length, pages.length);
      return pageNum;
    },

    enabled: !!rootDir?.dirId && !!templateType,
  });

  const modelsTotal = useMemo(() => {
    if (modelsData) {
      const total = modelsData.pages.reduce((total, cur) => {
        return total + cur.length;
      }, 0);
      return total;
    }
    return 0;
  }, [modelsData]);

  const callback = useCallback<IntersectionObserverCallback>((entries) => {
    entries.forEach((entry) => {
      const { modelsData, isFetching, fetchNextPage } = ref.current;

      kmDebug("useIntersectionObserver", modelsData?.pages.length, isFetching, entry.isIntersecting);
      // 滚动到底部取消自动滚动
      if (entry.isIntersecting && modelsData && modelsData.pages.length > 0) {
        fetchNextPage();
      }
    });
  }, []);

  const loadMore = useCallback(() => {
    const { modelsData, isFetching, fetchNextPage } = ref.current;

    if (modelsData && modelsData.pages.length > 0 && !isFetching) {
      fetchNextPage();
    }
  }, []);

  const ref = useRef({ modelsData, isFetching, loadMore, fetchNextPage, height: 0 });
  ref.current.modelsData = modelsData;
  ref.current.isFetching = isFetching;

  return { modelsData, modelsTotal, callback, ref, hasNextPage, isFetching };
}
