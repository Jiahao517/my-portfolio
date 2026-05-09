import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="art-static-page analytics-privacy">
      <Link href="/" className="art-static-page__link">返回首页</Link>
      <h1>隐私说明</h1>
      <p>
        本网站会收集匿名化访问行为数据，包括页面访问、停留时长、滚动深度、按钮点击、设备类型、来源页面，以及基于网络地址推断的粗略城市和网络组织信息。
      </p>
      <p>
        这些数据仅用于理解作品集浏览体验、优化内容呈现和判断不同作品模块的关注度。本站不会公开访问数据，不尝试识别具体个人身份，也不会将完整 IP 地址展示在后台。
      </p>
      <p>
        热区与行为分析可能由 Microsoft Clarity 提供，页面中的联系方式和输入内容会尽量避免进入分析数据。
      </p>
    </main>
  );
}
