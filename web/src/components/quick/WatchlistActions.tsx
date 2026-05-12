import type { ProcessedTopic } from "@/types";

export function WatchlistActions({ topics }: { topics: ProcessedTopic[] }) {
  const watchTiles = [
    ["Agent 定价方式", "观察是否从 seat-based 转向 outcome-based 或 workflow-based。"],
    ["企业权限治理", "关注日志、审批、沙盒执行是否被提升到默认叙述层。"],
    ["多模型编排", "留意产品是否开始默认用小模型做路由，大模型做收口。"],
    ["高信号分发", "简报与社区传播链路是否被重新设计成摘要先行。"],
  ];
  const actions = [
    "把现有首页的多栏目结构砍到 5 个区块以内，首页先服务快速判断。",
    "建立统一的简报卡片模板：结论、原因、影响、行动建议四段式。",
    "为深度情报和快讯做不同的信息节奏，不要共用同一版式骨架。",
    "后续补一版移动端简报页，让它更像 premium newsletter 而不是网站首页。",
  ];

  return (
    <div className="lower-grid">
      <article className="card watch-card">
        <div className="card-pad">
          <div className="kicker-row"><span className="pill">Watchlist</span></div>
          <h3>接下来 72 小时值得持续观察的 4 个变量。</h3>
          <p>简报页不用把所有新闻都列出，但必须告诉用户接下来该盯什么。</p>
          <div className="watch-grid">
            {watchTiles.map(([title, description]) => (
              <div key={title} className="watch-tile">
                <strong>{title}</strong>
                <span>{description}</span>
              </div>
            ))}
          </div>
        </div>
      </article>

      <article className="card watch-card">
        <div className="card-pad">
          <div className="kicker-row"><span className="pill">Next actions</span></div>
          <h3>{topics[1]?.title ?? "如果把这页做成产品页，建议下一步这么迭代。"}</h3>
          <p>{topics[1]?.summary ?? "这部分不是资讯本身，而是给团队的页面设计建议，帮助继续收敛方向。"}</p>
          <ul>
            {actions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
