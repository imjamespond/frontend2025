import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Col, Row, Select, type DropdownProps } from "antd";
import { KmButton, KmDropdown, KmInput, KmSpin } from "@components";
import { useSetTemplateType, useTemplateType } from "../context";
import { useSearch, useTemplates } from "./service";
import { CloseOutlined } from "@ant-design/icons";
import { useSearchTabsStyles } from "./styles";
import { GraphType, } from "./helper";
import { useDebounceFn } from "ahooks";
import { useDataMap } from "../service";
import { searchAll, type SearchReturnType } from "./searchHelper";

function FC() {
  const { styles } = useSearchTabsStyles();

  const { data } = useDataMap();
  const [, searching, { reset: resetResult }] = useSearch();
  const { data: listSupportTemplates } = useTemplates();
  const templateType = useTemplateType();
  const setTemplateType = useSetTemplateType();

  const [type] = useState<GraphType>(GraphType.Summary);
  const [activeKey] = useState<"1" | "2" | "3" | "4">("2");
  const [focus, setFocus] = useState(false);
  const [value, setValue] = useState<string>();
  const [, setSearchText] = useState<string>();
  const [, setMapResult] = useState<SearchReturnType>();

  useEffect(() => {
    setValue(process.env.devMode ? "市" : "");
    setFocus(false);
  }, [type]);

  // 搜索
  const onSearch = useDebounceFn((searchText: string, activeKey: string) => {
    setSearchText(searchText);
    setMapResult(undefined);
    resetResult();
    if (data && searchText) {
      // 搜索地图
      if (activeKey === "1" || activeKey === "2") {
        setMapResult(searchAll(searchText, data));
      }
      // searchFn({ keyword: searchText, indexibleTypeNames: [getSearchType(activeKey)] })
    }
  }).run;

  // 搜索框变动
  const onChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      resetResult();
      setMapResult(undefined);
      setValue(e.target.value);
    },
    [activeKey]
  );

  // 搜索下拉框
  const dropdownRender = useMemo<DropdownProps["popupRender"]>(
    () => (_menu) =>
      (
        <div
          onMouseDown={(e) => e.preventDefault()} //防止丢失焦点, mousedown -> focusout
        >
          <div className="__close">
            <KmButton icon={<CloseOutlined />} type="link" onClick={() => setFocus(false)} />
          </div>
          <div>
            {/* <SearchResult
              searchText={searchText}
              searchResult={result}
              activeKey={activeKey}
              mapResult={mapResult}
              extra={{
                setFocus,
              }}
            /> */}
          </div>
        </div>
      ),
    []
  );

  return (
    <React.Fragment>
      <KmSpin spinning={searching}>
        <Row className="__search">
          <Col xs={24} md={{ span: 6 }} lg={{ span: 8 }}>
            <Select
              style={{ width: 150, marginLeft: 10 }}
              placeholder="模板选择"
              value={templateType}
              onChange={(val) => {
                setTemplateType(val);
                onSearch(val, activeKey);
              }}
            >
              {listSupportTemplates?.map((item, i) => {
                return (
                  <Select.Option key={i} value={item.type}>
                    {item.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Col>
          <Col xs={24} md={{ span: 12 }} lg={{ span: 8 }}>
            <KmDropdown
              overlayClassName={styles.root}
              popupRender={dropdownRender}
              trigger={["click"]}
              open={focus}
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
                  setFocus(true);
                }}
                onFocus={() => {
                  setFocus(true);
                }}
                onBlur={() => {
                  if (process.env.devMode) {
                    return;
                  }
                  setFocus(false);
                }}
              />
            </KmDropdown>
          </Col>
        </Row>
      </KmSpin>
    </React.Fragment>
  );
}

export default FC;
