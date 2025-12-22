const swrConfig = {
  dedupingInterval: 10000, // 相同key,指定时间内去重
  revalidateIfStale: true, // 当有旧数据时是否刷新
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export default swrConfig;
