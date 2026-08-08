<script setup>
import { ref, onMounted } from "vue"

const skills = ["HTML", "CSS", "JavaScript", "Vue", "Node.js", "Express", "MySQL", "Git"]
const projects = ref([])

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
      <h1 class="title-word">我的前端主页</h1>
      <nav aria-label="主要导航">
        <a href="#hero">首屏介绍</a>
        <a href="#about">关于我</a>
        <a href="#skills">技能区</a>
        <a href="#featured-projects">精选项目</a>
        <a href="#project-dashboard">项目管理入口</a>
        <a href="#contact">联系方式</a>
        <a href="#footer">页脚</a>
      </nav>
    </header>

    <main>
      <section id="hero" class="hero-section">
        <h2>前端开发学习者 / Vue 项目构建中</h2>
        <p>目标：构建一个 Vue + Express + MySQL 的作品管理系统</p>
      </section>

      <section id="about" class="page-section">
        <h2>关于我</h2>
        <p>正在学习前端，当前重点是 Vue、后端接口、MySQL</p>
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
        <p v-if="loading" class="status-message" >项目加载中...</p>
        <p v-else-if="errorMessage" class="status-message error-message">{{ errorMessage }}</p>
        <p v-else-if="projects.length === 0" class="status-message empty-message">暂无项目，请先添加项目</p>

        <div v-else class="project-grid">
          <article class="project-card" v-for="project in projects" :key="project.id">
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
        <p>邮箱：待补充</p>
        <p>GitHub：待补充</p>
      </section>

    </main>
    <footer id="footer" class="site-footer">
        <p>© 2026 我的前端作品集</p>
    </footer>
  </div>
</template>
