import "./App.css";
import { App, ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { StyleProvider, legacyLogicalPropertiesTransformer } from "@ant-design/cssinjs";
import { SWRConfig } from "swr";
import swrConfig from "@config/swr";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "@config/tanstack";
import { useAppTheme } from "@config/app";
import View from "./view";

dayjs.locale("zh-cn");

const FC = () => {
  const theme = useAppTheme();
  return (
    <StyleProvider hashPriority="high" transformers={[legacyLogicalPropertiesTransformer]}>
      <App>
        <QueryClientProvider client={queryClient}>
          <SWRConfig value={swrConfig}>
            <ConfigProvider locale={zhCN} prefixCls="km" theme={theme}>
              <View />
            </ConfigProvider>
          </SWRConfig>
        </QueryClientProvider>
      </App>
    </StyleProvider>
  );
};

export default FC;
