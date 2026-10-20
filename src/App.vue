<script setup>
import { ref, computed, onMounted } from "vue"

const skills = ["HTML", "CSS", "JavaScript", "Vue", "Node.js", "Express", "MySQL", "Git"]
const projects = ref([])
const featuredProjects = [
  {
    title: "个人前端求职主页",
    description: "使用语义化 HTML、CSS 和原生 JavaScript 搭建个人求职展示页面，包含个人介绍、技能展示、项目经历和联系方式。",
    tech_stack: "HTML5 · CSS3 · JavaScript · DOM",
    repoUrl: "https://github.com/xixiayu45-sys/portfolio-project"
  },
  {
    title: "Vue 个人作品集",
    description: "基于 Vue 3、Vite、Express 和 MySQL 构建个人作品集，使用响应式布局展示个人资料与项目，并通过接口实现项目数据管理。",
    tech_stack: "Vue 3 · Vite · Express · MySQL · REST API",
    repoUrl: "https://github.com/xixiayu45-sys/vue-portfolio-project"
  },
  {
    title: "TicketRush 票务活动管理后端",
    description: "基于 Spring Boot、MyBatis-Plus 和 MySQL 构建票务活动管理接口，提供活动增删改查、分页查询、库存与时间校验、统一响应和全局异常处理，并持续扩展用户注册与密码加密能力。",
    tech_stack: "Java · Spring Boot · MyBatis-Plus · MySQL · REST API",
    repoUrl: "https://github.com/xixiayu45-sys/TicketRush"
  }
]

const databaseProjects = computed(() => {
  const featuredTitles = new Set(featuredProjects.map((project) => {
    return project.title.trim().toLowerCase()
  }))
  return projects.value.filter((project) => {
    return !featuredTitles.has(String(project.title).trim().toLowerCase())
  })
})

const loading = ref(false)
const errorMessage = ref("")
async function loadProjects() {
  loading.value = true
  errorMessage.value = ""
  try {
    const resp = await fetch("http://localhost:3000/api/projects")
    if (!resp.ok) {
      throw new Error("项目列表加载失败！")
    }
    const res = await resp.json()
    projects.value = res.data
  } catch (error) {
    errorMessage.value=error.message
  } finally {
    loading.value=false
  }
}
onMounted(loadProjects)

const newProjectTitle = ref("")
const newProjectDescription = ref("")
const newProjectTech_stack = ref("");

async function addProjects() { 
  const title = newProjectTitle.value.trim()
  const description = newProjectDescription.value.trim()
  const tech_stack = newProjectTech_stack.value.trim()

  if (!title || !description || !tech_stack) {
    alert("表单内不能为空！")
    return
  } 
  await fetch("http://localhost:3000/api/projects",{
    method: "post",
    headers: {
      "Content-type":"application/json"
    },
    body: JSON.stringify({
      title: title,
      description: description,
      tech_stack:tech_stack
      })
    })
    await loadProjects()
    newProjectTitle.value = ""
    newProjectDescription.value = ""
    newProjectTech_stack.value = ""
}

async function putProjects(project) {
  const title = prompt("请输入新的标题", project.title)
  const description = prompt("请输入新的项目描述", project.description)
  const tech_stack = prompt("请输入新的技术栈", project.tech_stack)

  if (!title || !description || !tech_stack) {
    return
  }
  
  await fetch(`http://localhost:3000/api/projects/${project.id}`,{
    method:"put",
    headers: {
      "Content-Type":"application/json"
    },
    body: JSON.stringify({
      title,
      description,
      tech_stack
    }),
  })
  await loadProjects()
}

async function deleteProjects(id) {
  const isOk = confirm("确定要删除吗？")
  if (!isOk) {
    alert("已取消")
    return
  }
  await fetch(`http://localhost:3000/api/projects/${id}`,{
    method:"delete"
  })
  await loadProjects()
}

</script>

<template>
  <div class="app-shell">
    <header class="site-header">
      <h1 class="title-word">我的前端作品集</h1>
      <nav aria-label="主要导航">
        <a href="#hero">首页</a>
        <a href="#about">关于我</a>
        <a href="#skills">技能</a>
        <a href="#featured-projects">项目展示</a>
        <a href="#project-dashboard">项目管理</a>
        <a href="#contact">联系我</a>
      </nav>
    </header>

    <main>
      <section id="hero" class="hero-section">
        <h2>前端开发作品集 / Vue 项目实践</h2>
        <p>基于 Vue 3、Express 和 MySQL 构建的个人作品展示与项目管理页面</p>
      </section>

      <section id="about" class="page-section">
        <h2>关于我</h2>
        <p>我是一名计算机科学与技术专业学生，专注于前端开发方向，熟悉 HTML、CSS、JavaScript 基础，正在学习 Vue 3、接口交互和 MySQL 数据库应用，能够独立完成基础页面开发和项目部署。</p>
      </section>

      <section id="skills" class="page-section">
        <h2>技能栈</h2>
        <ul class="skills-list">
          <li v-for="skill in skills" :key="skill">
            {{ skill }}
          </li>
        </ul>
      </section>

      <section id="featured-projects" class="page-section">
        <h2>项目</h2>
        <p v-if="loading" class="status-message">数据库项目加载中...</p>
        <p v-else-if="errorMessage" class="status-message error-message">数据库项目加载失败：{{ errorMessage }}</p>
        <p v-else-if="databaseProjects.length === 0" class="status-message empty-message">已展示精选项目，可在下方继续添加其他项目。</p>

        <div class="project-grid">
          <article class="project-card featured-project-card" v-for="project in featuredProjects" :key="project.repoUrl">
            <p class="project-kicker">Featured Project</p>
            <h3>{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <p class="project-tech-text">{{ project.tech_stack }}</p>
            <div class="article-bt">
              <a
                class="project-link"
                :href="project.repoUrl"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="`在新窗口打开 ${project.title} 的 GitHub 仓库`"
              >
                查看 GitHub 仓库
              </a>
            </div>
          </article>

          <article class="project-card" v-for="project in databaseProjects" :key="project.id">
            <h3>{{ project.title }}</h3>
            <p class="project-desc">{{ project.description }}</p>
            <p class="project-tech-text">{{ project.tech_stack }}</p>
            <!-- <ul class="project-techs">
              <li v-for="tech in project.tech_stack" :key="tech">
                {{ tech }}
              </li>
            </ul> -->

            <div class="article-bt">
              <button type="button" @click="putProjects(project)" class="secondary-button">编辑</button>
              <button type="button" @click="deleteProjects(project.id)" class="danger-button">删除</button>
            </div>

          </article>
        </div>
      </section>

      <section id="project-dashboard" class="page-section">
        <h2>项目管理入口</h2>
        <p>后续会支持项目展示、新增、编辑、删除、筛选和数据库保存</p>
        <form @submit.prevent="addProjects" class="project-form">
          <label for="projectTitle">项目名称：</label>
          <input v-model="newProjectTitle" id="projectTitle" type="text" placeholder="请输入你的项目名称：">

          <label for="projectDescription" >项目描述：</label>
          <input v-model="newProjectDescription" id="projectDescription" type="text" placeholder="请输入你的项目名称：">

          <label for="projectTech_stack">技术栈：</label>
          <input v-model="newProjectTech_stack" id="projectTech_stack" type="text" placeholder="请输入你的项目名称：">

          <button type="submit" class="primary-button">添加</button>
        </form>
      </section>

      <section id="contact" class="page-section">
        <h2>联系方式</h2>
        <p>邮箱：y459452003@163.com</p>
        <p>电话：17370743547</p>
        <p>GitHub：https://github.com/xixiayu45-sys</p>
      </section>

    </main>
    <footer id="footer" class="site-footer">
        <p>© 2026 我的前端作品集</p>
    </footer>
  </div>
</template>
