// 国内DNS服务器
const domesticNameservers = [
  "https://223.5.5.5/dns-query#DIRECT", // 阿里云公共DNS
  "https://doh.pub/dns-query#DIRECT", // 腾讯DNSPod
];
// 国外DNS服务器
const foreignNameservers = [
  "https://dns.google/dns-query#Using", // Google
  "https://1.0.0.1/dns-query#Using", // Cloudflare
];
// DNS配置
const dnsConfig = {
  "enable": true,
  "listen": "0.0.0.0:1053",
  "ipv6": false,
  "use-system-hosts": false,
  "cache-algorithm": "arc",
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    // 本地主机/设备
    "+.lan",
    "+.local",
    // Windows网络出现小地球图标
    "+.msftconnecttest.com",
    "+.msftncsi.com",
    // QQ快速登录检测失败
    "localhost.ptlogin2.qq.com",
    "localhost.sec.qq.com",
    // 微信快速登录检测失败
    "localhost.work.weixin.qq.com"
  ],
  "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1", "8.8.8.8"],
  "nameserver": [...domesticNameservers, ...foreignNameservers],
  "proxy-server-nameserver": [...domesticNameservers, ...foreignNameservers],
  "nameserver-policy": {
    "geosite:private,cn,geolocation-cn": domesticNameservers,
    "geosite:google,youtube,telegram,gfw,geolocation-!cn": foreignNameservers
  }
};
// 规则集通用配置
const ruleProviderCommon = {
  "type": "http",
  "format": "yaml",
  "interval": 86400
};
// 规则集配置
const ruleProviders = {
  "anti-ad": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://anti-ad.net/clash.yaml",
    "path": "./ruleset/loyalsoldier/antiad.yaml"
  },
  "Microsoft": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Microsoft/Microsoft_No_Resolve.yaml",
    "path": "./ruleset/loyalsoldier/Microsoft.yaml"
  },
  "Copilot": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Copilot/Copilot_No_Resolve.yaml",
    "path": "./ruleset/loyalsoldier/Copilot.yaml"
  },
  "OpenAI": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
    "path": "./ruleset/loyalsoldier/OpenAI.yaml"
  },
  "Jetbrains": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Jetbrains/Jetbrains_No_Resolve.yaml",
    "path": "./ruleset/loyalsoldier/Jetbrains.yaml"
  },
  "Spotify": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Spotify/Spotify_No_Resolve.yaml",
    "path": "./ruleset/loyalsoldier/Spotify.yaml"
  },
  "YouTube": {
    ...ruleProviderCommon,
    "behavior": "classical",
    "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/YouTube/YouTube.yaml",
    "path": "./ruleset/loyalsoldier/YouTube.yaml"
  },
  "YouTubeMusic": {
    ...ruleProviderCommon,
    "behavior": "domain",
    "url": "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/YouTubeMusic/YouTubeMusic.yaml",
    "path": "./ruleset/loyalsoldier/YouTubeMusic.yaml"
  }
};
// 规则
const rules = [
  "RULE-SET, anti-ad, REJECT",
  "RULE-SET, Copilot, Copilot",
  "RULE-SET, YouTube, Using",
  "RULE-SET, YouTubeMusic, Using",
  "RULE-SET, Microsoft, DIRECT",
  "RULE-SET, OpenAI, OpenAI",
  "RULE-SET, Jetbrains, Using",
  "RULE-SET, Spotify, JP",
  // 其他规则
  "GEOIP, LAN, DIRECT, no-resolve",
  "GEOIP, CN, DIRECT, no-resolve",
  "MATCH, Using"
];
// 代理组通用配置
const groupBaseOption = {
  "interval": 300,
  "timeout": 3000,
  "url": "https://www.google.com/generate_204",
  "lazy": true,
  "max-failed-times": 3,
  "hidden": false
};

// 程序入口
function main(config) {
  const proxyCount = config?.proxies?.length ?? 0;
  const proxyProviderCount =
    typeof config?.["proxy-providers"] === "object" ? Object.keys(config["proxy-providers"]).length : 0;
  if (proxyCount === 0 && proxyProviderCount === 0) {
    throw new Error("配置文件中未找到任何代理");
  }

  // 覆盖原配置中DNS配置
  config["dns"] = dnsConfig;

  // 覆盖原配置中的代理组
  config["proxy-groups"] = [
    {
      ...groupBaseOption,
      "name": "Using",
      "type": "select",
      "proxies": ["SG", "HK", "US", "JP"],
      "include-all": true,
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/fish.svg"
    },
    {
      ...groupBaseOption,
      "name": "OpenAI",
      "type": "select",
      "proxies": ["US", "SG"],
      // "include-all": true,
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/chatgpt.svg"
    },
    {
      ...groupBaseOption,
      "name": "Copilot",
      "type": "select",
      "proxies": ["US", "SG"],
      // "include-all": true,
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/bing.svg"
    },
    // {
    //   ...groupBaseOption,
    //   "name": "Spotify",
    //   "type": "select",
    //   "proxies": ["SG", "HK", "JP"],
    //   "include-all": true,
    //   // "icon": "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/balance.svg"
    // },
    {
      ...groupBaseOption,
      "name": "SG",
      "type": "select",
      "proxies": ["SG Delay"],
      "include-all": true,
      "filter": "(?=.*(🇸🇬|新加坡|\bSG|\bSGP|\bSingapore|狮城))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/sg.svg"
    },
    {
      ...groupBaseOption,
      "name": "HK",
      "type": "select",
      "proxies": ["HK Delay"],
      "include-all": true,
      "filter": "(?=.*(🇭🇰|香港|\bHK|\bHKG|\bHong))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/hk.svg"
    },
    {
      ...groupBaseOption,
      "name": "US",
      "type": "select",
      "proxies": ["US Delay"],
      "include-all": true,
      "filter": "(?=.*(🇺🇸|美国|\bUS|\bUnited|\bUSA))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/us.svg"
    },
    {
      ...groupBaseOption,
      "name": "JP",
      "type": "select",
      "proxies": ["JP Delay"],
      "include-all": true,
      "filter": "(?=.*(🇯🇵|日本|\bJP|\bJapan|\bJapanese))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/jp.svg"
    },
    {
      ...groupBaseOption,
      "name": "SG Delay",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "filter": "(?=.*(🇸🇬|新加坡|\bSG|\bSGP|\bSingapore|狮城))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/sg.svg"
    },
    {
      ...groupBaseOption,
      "name": "HK Delay",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "filter": "(?=.*(🇭🇰|香港|\bHK|\bHKG|\bHong))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/hk.svg"
    },
    {
      ...groupBaseOption,
      "name": "US Delay",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "filter": "(?=.*(🇺🇸|美国|\bUS|\bUnited|\bUSA))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/us.svg"
    },
    {
      ...groupBaseOption,
      "name": "JP Delay",
      "type": "url-test",
      "tolerance": 100,
      "include-all": true,
      "filter": "(?=.*(🇯🇵|日本|\bJP|\bJapan|\bJapanese))^(?!.*(0.1x|Game)).*",
      "icon": "https://raw.githubusercontent.com/clash-verge-rev/clash-verge-rev.github.io/refs/heads/main/docs/assets/icons/flags/jp.svg"
    }
  ];

  // 覆盖原配置中的规则
  config["rule-providers"] = ruleProviders;
  config["rules"] = rules;

  // 返回修改后的配置
  return config;
}