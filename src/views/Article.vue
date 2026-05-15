<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { NConfigProvider, NIcon, darkTheme, NAvatar, NSwitch } from 'naive-ui'
import { Sunny, Moon, LogoGithub, ArrowBack, Calendar, Pricetag } from '@vicons/ionicons5'
import { articles, loadArticleContent } from '../data/articles'
import QuestionBlock from '../components/QuestionBlock.vue'

interface QuestionOption {
  label: string
  text: string
}

interface QuestionData {
  id: string
  stem: string
  choices: QuestionOption[]
  answer: string
  explanation?: string
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

const isDark = ref(true)
const route = useRoute()
const articleContent = ref('')
const isLoading = ref(true)
const questions = ref<QuestionData[]>([])

const article = computed(() => {
  const slug = route.params.slug as string
  return articles.find(a => a.slug === slug)
})

/**
 * 预处理 Markdown：提取选择题，替换为占位符
 */
function preprocessMarkdown(content: string): { html: string; questions: QuestionData[] } {
  const extractedQuestions: QuestionData[] = []
  const questionRe = /<!--\s*question\s+id="([^"]+)"\s*-->\s*([\s\S]*?)<!--\s*\/question\s*-->/g

  let processed = content
  let match: RegExpExecArray | null

  questionRe.lastIndex = 0
  while ((match = questionRe.exec(content)) !== null) {
    const qid = match[1].trim()
    const rawBody = match[2].trim()

    // 解析 answer 代码块
    const answerRe = /```answer\s*\n([A-D])\s*\n```/i
    const answerMatch = answerRe.exec(rawBody)
    const answer = answerMatch ? answerMatch[1].toUpperCase() : ''

    // 去掉 answer 代码块
    let bodyWithoutAnswer = rawBody
      .replace(/```answer\s*\n[A-D]\s*\n```/i, '')
      .trim()

    // 分离解析文字（支持【解析】或「解析」或 解析: 格式）
    let explanation = ''
    const explanationRe = /(?:^|\n)(?:【|"|「)?[\u4e00-\u9fa5]*(?:解析)[】:」]?\s*([\s\S]*)$/i
    const explanationMatch = explanationRe.exec(bodyWithoutAnswer)
    if (explanationMatch) {
      explanation = explanationMatch[1].trim()
      bodyWithoutAnswer = bodyWithoutAnswer.slice(0, explanationMatch.index).trim()
    }

    // 解析选项 A. B. C. D.
    const lines = bodyWithoutAnswer.split('\n')
    const stemLines: string[] = []
    const choices: QuestionOption[] = []

    for (const line of lines) {
      const optionMatch = line.match(/^([A-D])\.\s*([\s\S]*)$/i)
      if (optionMatch) {
        choices.push({
          label: optionMatch[1].toUpperCase(),
          text: optionMatch[2].trim()
        })
      } else if (line.trim()) {
        stemLines.push(line)
      }
    }

    const stem = stemLines.join('\n').trim()

    extractedQuestions.push({ id: qid, stem, choices, answer, explanation })

    // 替换为占位注释，渲染时会被忽略
    processed = processed.replace(match[0], `\n<!-- QUESTION:${extractedQuestions.length - 1} -->\n`)
  }

  // 渲染 markdown（选择题已被替换为注释）
  const html = md.render(processed)

  // 清理残留的占位注释
  const cleanHtml = html.replace(/<!-- QUESTION:\d+ -->/g, '')

  return { html: cleanHtml, questions: extractedQuestions }
}

const renderedContent = computed(() => {
  if (!articleContent.value) return ''
  const processed = preprocessMarkdown(articleContent.value)
  return processed.html
})

watch(
  () => route.params.slug,
  async (slug) => {
    if (!slug) return
    isLoading.value = true
    const content = await loadArticleContent(slug as string)
    articleContent.value = content
    const processed = preprocessMarkdown(content)
    questions.value = processed.questions
    isLoading.value = false
  },
  { immediate: true }
)

const themeOverrides = computed(() => ({
  common: {
    primaryColor: '#22c55e',
    primaryColorHover: '#4ade80',
    primaryColorPressed: '#16a34a',
    borderRadius: '4px',
  }
}))
</script>

<template>
  <NConfigProvider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div class="min-h-screen" :class="isDark ? 'bg-black text-gray-300' : 'bg-white text-gray-700'">
      <!-- Header -->
      <header class="fixed top-0 left-0 right-0 z-50 border-b" 
        :class="isDark ? 'bg-black/90 border-gray-800' : 'bg-white/90 border-gray-200'">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <NAvatar :size="32" round :style="{ backgroundColor: '#22c55e' }">R</NAvatar>
            <span class="font-mono text-sm" :class="isDark ? 'text-gray-100' : 'text-gray-900'">romeochen</span>
          </div>
          <div class="flex items-center gap-4">
            <a :href="'https://github.com/RomeoChen'" target="_blank" class="p-1 hover:opacity-60 transition">
              <NIcon :component="LogoGithub" :size="18" />
            </a>
            <NSwitch v-model:value="isDark" :round="false">
              <template #checked>
                <NIcon :component="Moon" :size="12" />
              </template>
              <template #unchecked>
                <NIcon :component="Sunny" :size="12" />
              </template>
            </NSwitch>
          </div>
        </div>
      </header>

      <!-- Main -->
      <main class="pt-20 pb-16 px-6">
        <div class="max-w-5xl mx-auto flex gap-8">
          <!-- Left: Article Menu -->
          <aside class="w-64 shrink-0 hidden md:block">
            <div class="fixed top-20 overflow-y-auto max-h-[calc(100vh-6rem)] w-64 pr-4">
              <a href="/" class="flex items-center gap-2 text-xs font-mono mb-4 hover:opacity-60" 
                :class="isDark ? 'text-green-500' : 'text-green-600'">
                <NIcon :component="ArrowBack" :size="14" />
                <span>← Back</span>
              </a>
              <h3 class="text-xs font-mono uppercase tracking-wider mb-3" 
                :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                ## Articles
              </h3>
              <div class="space-y-1">
                <a v-for="a in articles" :key="a.slug" 
                  :href="'/article/' + a.slug"
                  class="block text-xs font-mono py-1.5 px-2 rounded transition"
                  :class="[
                    a.slug === article?.slug 
                      ? (isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900')
                      : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-900')
                  ]">
                  {{ a.title }}
                </a>
              </div>
            </div>
          </aside>

          <!-- Right: Article Content -->
          <article class="flex-1 min-w-0">
            <div v-if="article" class="max-w-3xl">
              <div class="mb-8">
                <h1 class="text-2xl font-mono font-bold mb-3" :class="isDark ? 'text-gray-100' : 'text-gray-900'">
                  {{ article.title }}
                </h1>
                <div class="flex items-center gap-4 text-xs font-mono" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  <span class="flex items-center gap-1">
                    <NIcon :component="Calendar" :size="12" />
                    {{ article.date }}
                  </span>
                  <span class="flex items-center gap-1">
                    <NIcon :component="Pricetag" :size="12" />
                    {{ article.tags.join(', ') }}
                  </span>
                </div>
              </div>

              <!-- Loading -->
              <div v-if="isLoading" class="py-20 text-center">
                <p class="font-mono text-gray-500">Loading...</p>
              </div>

              <!-- Content + Questions -->
              <div v-else>
                <!-- Markdown 正文 -->
                <div class="markdown-body font-mono text-sm leading-relaxed"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                  v-html="renderedContent">
                </div>

                <!-- 交互式选择题（渲染在 markdown 之后） -->
                <div v-if="questions.length > 0" class="mt-8 pt-6 border-t border-gray-800">
                  <div class="flex items-center gap-2 mb-4">
                    <span class="text-xs font-mono px-2 py-1 rounded bg-green-500/20 text-green-400">
                      {{ questions.length }} 道练习题
                    </span>
                    <span class="text-xs font-mono text-gray-500">已作答题目自动保存到本地</span>
                  </div>
                  <QuestionBlock
                    v-for="q in questions"
                    :key="q.id"
                    :data="q"
                    :slug="article.slug"
                  />
                </div>
              </div>
            </div>
            <div v-else class="text-center py-20">
              <p class="font-mono text-gray-500">Article not found</p>
            </div>
          </article>
        </div>
      </main>

      <!-- Footer -->
      <footer class="py-8 text-center border-t" :class="isDark ? 'border-gray-800 text-gray-600' : 'border-gray-200 text-gray-400'">
        <p class="text-xs font-mono">© 2026</p>
      </footer>
    </div>
  </NConfigProvider>
</template>

<style>
.markdown-body h1 { font-size: 1.5rem; font-weight: bold; margin: 1.5rem 0 1rem; }
.markdown-body h2 { font-size: 1.25rem; font-weight: bold; margin: 1.25rem 0 0.75rem; }
.markdown-body h3 { font-size: 1.1rem; font-weight: bold; margin: 1rem 0 0.5rem; }
.markdown-body p { margin: 0.75rem 0; }
.markdown-body ul, .markdown-body ol { margin: 0.75rem 0; padding-left: 1.5rem; }
.markdown-body li { margin: 0.25rem 0; }
.markdown-body code { 
  background: rgba(34, 197, 94, 0.15); 
  padding: 0.15rem 0.35rem; 
  border-radius: 3px; 
  font-size: 0.85em;
}
.markdown-body pre { 
  background: rgba(34, 197, 94, 0.1); 
  padding: 1rem; 
  border-radius: 4px; 
  overflow-x: auto;
  margin: 1rem 0;
}
.markdown-body pre code { 
  background: none; 
  padding: 0; 
}
.markdown-body a { 
  color: #22c55e; 
  text-decoration: underline;
}
.markdown-body blockquote {
  border-left: 3px solid #22c55e;
  padding-left: 1rem;
  margin: 1rem 0;
  opacity: 0.8;
}
.markdown-body table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}
.markdown-body th, .markdown-body td {
  border: 1px solid;
  padding: 0.5rem 0.75rem;
  text-align: left;
}
.markdown-body th {
  background: rgba(34, 197, 94, 0.1);
}
</style>
