import fs from 'fs';
import path from 'path';

const appPath = path.join(process.cwd(), 'src', 'App.tsx');
let appCode = fs.readFileSync(appPath, 'utf8');

const oldHandleTask = /const handleTaskClick = async \([^]*?processingTasksRef\.current\.delete\(taskId\);\s*}\s*};\n?/m;

const newHandleTask = `const handleTaskClick = async (taskId) => {
    if (!taskId || completedTaskIds.includes(taskId) || !user || processingTasksRef.current.has(taskId)) return;
    
    processingTasksRef.current.add(taskId);
    try {
      const response = await fetch('/api/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${window.Telegram?.WebApp?.initData}\`
        },
        body: JSON.stringify({ taskId })
      });
      const result = await response.json();
      
      if (!response.ok) throw new Error(result.error || 'Failed to complete task');

      if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
      }
    } catch (error) {
      console.error('Task Action Error', error);
    } finally {
      processingTasksRef.current.delete(taskId);
    }
  };\n`;

if (appCode.match(oldHandleTask)) {
  appCode = appCode.replace(oldHandleTask, newHandleTask);
  fs.writeFileSync(appPath, appCode);
  console.log('Replaced handleTaskClick successfully.');
} else {
  console.log('Could not match handleTaskClick.');
}
