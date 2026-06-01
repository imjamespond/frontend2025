import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { legacyLogicalPropertiesTransformer, StyleProvider } from "@ant-design/cssinjs";
import { useAppHeight, useAppTheme } from "@config/app";
import swrConfig from "@config/swr";
import queryClient from "@config/tanstack";
import { QueryClientProvider } from "@tanstack/react-query";
import { SWRConfig } from "swr";
import View from "./view";

import "./App.scss";

dayjs.locale("zh-cn");

const FC = () => {
  const theme = useAppTheme();
  const height = useAppHeight();
  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <ConfigProvider locale={zhCN} prefixCls="km" theme={theme}>
        <App style={{ height }}>
          <QueryClientProvider client={queryClient}>
            <SWRConfig value={swrConfig}>
              <View />
            </SWRConfig>
          </QueryClientProvider>
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default FC;
