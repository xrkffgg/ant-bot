const { commentIssue } = require('../../lib/github');
const translate = require('google-translate-api');

function containsChinese(title) {
  return /[\u4e00-\u9fa5]/.test(title);
}

function replyTranslate(on) {
  on('issues.opened', async ({ payload }) => {
    if (containsChinese(payload.issue.title)) {
      let content = `
Translation of this issue:

<hr/>

## ${payload.issue.title}

${payload.issue.body}
`;
      content = content.replace('<!-- generated by ant-design-issue-helper. DO NOT REMOVE -->', '');
      const res = await translate(content, { from: 'zh-CN', to: 'en' });

      commentIssue({
        owner: payload.repository.owner.login,
        repo: payload.repository.name,
        number: payload.issue.number,
        body: res.text,
      });
    }
  });
}

module.exports = replyTranslate;
