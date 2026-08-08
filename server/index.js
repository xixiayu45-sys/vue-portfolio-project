import express from "express"
import pool from "./db.js"
import cors from "cors"

const app = express()
const port = 3000


app.use(cors())
app.use(express.json())

app.get("/api/health", (req, res) => {
    res.json({
        ok: true,
        mess: "后端运行正常"
    })
})

app.get("/api/test", async (req, res) => {
    const [rows] = await pool.query("select 1 as result")
    res.json({
        ok: true,
        data: rows
    })
})

app.get("/api/projects", async (req, res) => {
    const [rows] = await pool.query("select id,title,description,tech_stack,created_at,updated_at from projects order by id desc")
    res.json({
        ok: true,
        data: rows
    })
})

app.post("/api/projects", async (req, res) => {
    const { title, description, tech_stack } = req.body
    if (!title || !description || !tech_stack) {
        return res.status(400).json({
            ok: false,
            message: "标题、描述和技术栈都不能为空"
        })
    }
    const [result] = await pool.query(
        "insert into projects (title, description, tech_stack) values (?, ?, ?) ",
        [title, description, tech_stack]
    )
    res.json({
        ok: true,
        data: {
            id: result.insertId,
            title,
            description,
            tech_stack
        }
    })
})

app.put("/api/projects/:id", async (req, res) => {
    const id = req.params.id
    const { title, description, tech_stack } = req.body

    await pool.query("update projects set title=?,description=?,tech_stack=? where id=?",
        [title, description, tech_stack, id]
    )
    res.json({ ok: true })
})

app.delete("/api/projects/:id", async (req, res) => {
    const id = req.params.id
    await pool.query(
        "delete from projects where id=?", [id]
    )
    res.json({ ok: true })
})

app.listen(port, () => {
    console.log(`后端已启动：http://localhost:${port}`)
})