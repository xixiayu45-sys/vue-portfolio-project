CREATE TABLE projects (
  id INT PRIMARY KEY AUTO_INCREMENT, --id 
  title VARCHAR(100) NOT NULL, --标题
  description TEXT NOT NULL, --项目卡片用它显示项目描述文字
  tech_stack VARCHAR(255) NOT NULL, --技术栈先用字符串保存
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --创建时自动记录当前时间
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP --创建时有默认时间，每次更新这行数据时自动刷新时间
);
