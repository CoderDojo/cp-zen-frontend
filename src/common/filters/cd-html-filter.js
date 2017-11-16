import sanitize from 'sanitize-html';

export default HTML => sanitize(HTML, { allowedTags: ['p', 'b', 'ul', 'li', 'br'] });
