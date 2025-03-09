const express = require('express');
const bodyParser = require('body-parser');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 4000;
const EXCEL_FILE_PATH = 'tasks.xlsx';

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname)));
app.use(bodyParser.json());

// Function to initialize the Excel file if it doesn't exist
function initializeExcelFile() {
    if (!fs.existsSync(EXCEL_FILE_PATH)) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Tasks');
        worksheet.columns = [
            { header: 'Username', key: 'username', width: 20 },
            { header: 'Description', key: 'description', width: 30 },
            { header: 'Priority', key: 'priority', width: 10 },
            { header: 'Completed', key: 'completed', width: 10 }
        ];
        workbook.xlsx.writeFile(EXCEL_FILE_PATH);
    }
}

// Initialize the Excel file
initializeExcelFile();

// POST endpoint to save task
app.post('/saveTask', async (req, res) => {
    const { username, description, priority } = req.body;

    if (!username || !description || !priority) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(EXCEL_FILE_PATH);
        const worksheet = workbook.getWorksheet('Tasks');

        worksheet.addRow({
            username,
            description,
            priority,
            completed: false
        });

        await workbook.xlsx.writeFile(EXCEL_FILE_PATH);

        res.status(200).json({ message: 'Task saved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save task' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
