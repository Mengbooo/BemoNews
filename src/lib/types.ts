export type ReportType = 'daily' | 'intelligence'

export type ImportanceLevel = 'BREAKING' | 'MAJOR' | 'NOTABLE'

export interface Article {
  id: string
  title: string
  link: string
  summary: string
  source: string
  sourceType: SourceType
  publishedAt: Date
  category: Category
}

export type SourceType = 'hn' | 'github' | 'arxiv' | 'twitter' | 'rss' | 'websearch'

export type Category = '全部' | 'AI' | '科技' | 'VC' | '行业' | '开发者'

export interface AIComment {
  perspective: string
  applications: string[]
  impact: string
}

export interface ProcessedArticle extends Article {
  aiComment: AIComment
  importance?: ImportanceLevel
  trending?: boolean
}

export interface BriefManifest {
  date: string
  type: ReportType
  title: string
  generatedAt: string
  stats: {
    total: number
    sources: number
    trending?: number
  }
}

export interface Manifest {
  version: string
  lastUpdated: string
  briefs: BriefManifest[]
}
