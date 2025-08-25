const convertToMarkdown = (text: string): string => {
  let markdown = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  markdown = markdown.replace(/(https?:\/\/[^\s]+)/g, '[$1]($1)');
  markdown = markdown.replace(/\*\*(.*?)\*\*/g, '**$1**');
  markdown = markdown.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '*$1*');
  markdown = markdown.replace(/```([\s\S]*?)```/g, '```$1```');
  markdown = markdown.replace(/`([^`]+)`/g, '`$1`');

  return markdown;
};

export default convertToMarkdown;
