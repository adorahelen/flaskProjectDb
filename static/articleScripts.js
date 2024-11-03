document.addEventListener("DOMContentLoaded", () => {
    fetch('/api/articles')  // 엔드포인트 수정
        .then(response => response.json())
        .then(data => {
            const articlesList = document.getElementById('articles-list');
            data.forEach(article => {
                const articleElement = document.createElement('div');
                articleElement.classList.add('article');
                articleElement.innerHTML = `
                    <h2>${article.title}</h2>
                    <p><strong>Author:</strong> ${article.author}</p>
                    <p><strong>Content:</strong> ${article.content}</p>
                    <p><strong>Created At:</strong> ${new Date(article.created_at).toLocaleString()}</p>
                    <p><strong>View Count:</strong> ${article.view_count}, <strong>Like Count:</strong> ${article.like_count}</p>
                `;

                // Add files
                if (article.files.length > 0) {
                    const filesElement = document.createElement('div');
                    filesElement.innerHTML = "<h3>Files:</h3>";
                    article.files.forEach(file => {
                        const fileElement = document.createElement('div');
                        fileElement.classList.add('file');
                        fileElement.innerHTML = `<p><strong>File Name:</strong> ${file.original_file_name}</p>`;
                        filesElement.appendChild(fileElement);
                    });
                    articleElement.appendChild(filesElement);
                }

                // Add comments
                if (article.comments.length > 0) {
                    const commentsElement = document.createElement('div');
                    commentsElement.innerHTML = "<h3>Comments:</h3>";
                    article.comments.forEach(comment => {
                        const commentElement = document.createElement('div');
                        commentElement.classList.add('comment');
                        commentElement.innerHTML = `
                            <p><strong>Author:</strong> ${comment.comment_author}</p>
                            <p>${comment.comment_content}</p>
                        `;
                        commentsElement.appendChild(commentElement);
                    });
                    articleElement.appendChild(commentsElement);
                }

                articlesList.appendChild(articleElement);
            });
        })
        .catch(error => console.error('Error fetching articles:', error));
});