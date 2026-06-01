import { CloseOutlined } from "@ant-design/icons";
import { kmDebug } from "@common/misc";
import { KmButton, KmDropdown, KmInput, KmSpin } from "@components";
import { useDebounceEffect } from "ahooks";
import { Col, type DropdownProps, Row, Select } from "antd";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSetTemplateType, useTemplateType } from "../context";
import { useDataMap } from "../service";
import { useSetFindResult, useSetOpenHandle, useSetSearchResult, useSetSearchText } from "./contex";
import SearchResult from "./SearchResult";
import { searchData } from "./searchHelper";
import { useFind, useTemplates } from "./service";
import { useSearchTabsStyles } from "./styles";

function FC() {
  const { styles } = useSearchTabsStyles();

  const { data } = useDataMap();
  const [, finding, { data: findResult, reset: resetFind }] = useFind();
  const { data: listSupportTemplates } = useTemplates();

  const templateType = useTemplateType();
  const setTemplateType = useSetTemplateType();

  // const [type] = useState<GraphType>(GraphType.Summary);
  // Dropdown tab
  const [activeKey] = useState<"1" | "2" | "3" | "4">("2");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(process.env.devMode ? "市" : "");
  const setSearchText = useSetSearchText();
  const setSearchResult = useSetSearchResult();
  const setFindResult = useSetFindResult();

  useSetOpenHandle(setOpen);

  useEffect(() => {
    ref.current.setFindResult(findResult);
  }, [findResult]);

  // 搜索
  const onSearch = useCallback((searchText: string, activeKey: string) => {
    kmDebug("search", searchText, activeKey);
    const { data, setSearchText, resetFind, setSearchResult } = ref.current;
    setSearchText(searchText);
    setSearchResult(undefined);
    resetFind();
    if (data && searchText) {
      // 搜索地图
      if (activeKey === "1" || activeKey === "2") {
        setSearchResult(searchData(searchText, data));
      }
      // searchFn({ keyword: searchText, indexibleTypeNames: [getSearchType(activeKey)] })
    }
  }, []);

  useDebounceEffect(() => {
    onSearch(value, activeKey);
  }, [value, activeKey]);

  // 搜索框变动
  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>((e) => {
    ref.current.resetFind();
    ref.current.setSearchResult(undefined);
    setValue(e.target.value);
  }, []);

  // 搜索下拉框
  const dropdownRender = useMemo<DropdownProps["popupRender"]>(
    () => (_menu) => (
      <div
        onMouseDown={(e) => e.preventDefault()} //防止丢失焦点, mousedown -> focusout
      >
        <div className="__close">
          <KmButton icon={<CloseOutlined />} type="link" onClick={() => setOpen(false)} />
        </div>
        <div>
          <SearchResult activeKey={activeKey} />
          {/* {JSON.stringify({ activeKey })} */}
        </div>
      </div>
    ),
    [activeKey],
  );

  const onSelectTpl = (val: string) => {
    setTemplateType(val);
  };

  // 默认选中第一个
  useEffect(() => {
    if (templateType === undefined && listSupportTemplates && listSupportTemplates.length > 0) {
      ref.current.onSelectTpl(listSupportTemplates[0].type);
    }
  }, [listSupportTemplates, templateType]);

  const ref = useRef({ setSearchText, setSearchResult, setFindResult, resetFind, onSelectTpl, data });
  ref.current.data = data;

  return (
    <KmSpin spinning={finding}>
      <Row className="__search">
        <Col xs={24} md={{ span: 6 }} lg={{ span: 8 }}>
          <Select
            style={{ width: 150, marginLeft: 10 }}
            placeholder="模板选择"
            value={templateType}
            onChange={onSelectTpl}
            options={listSupportTemplates?.map((item) => {
              return { label: item.name, value: item.type };
            })}
          />
        </Col>
        <Col xs={24} md={{ span: 12 }} lg={{ span: 8 }}>
          <KmDropdown
            overlayClassName={styles.root}
            popupRender={dropdownRender}
            trigger={["click"]}
            open={open}
            destroyOnHidden
          >
            <KmInput.Search
              placeholder="搜索数据地图"
              allowClear
              enterButton
              size="large"
              value={value}
              onSearch={(searchText) => onSearch(searchText, activeKey)}
              onChange={onChange}
              onClick={() => {
                setOpen(true);
              }}
              onFocus={() => {
                setOpen(true);
              }}
              onBlur={() => {
                if (process.env.devMode) {
                  return;
                }
                setOpen(false);
              }}
            />
          </KmDropdown>
        </Col>
      </Row>
    </KmSpin>
  );
}

export default FC;
