//localhost:3000/articles/learn-node
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from 'axios';
import articles from "./article-content";
import useUser from "../hooks/useUser";
import NotFoundPage from "./NotFoundPage";
import CommentsList from "../components/CommentsList";
import AddCommentForm from "../components/AddCommentForm";

const ArticlePage = () => {
    const [articleInfo, setArticleInfo] = useState({ upvotes: 0, comments: [], canUpvote: true });
    const { canUpvote } = articleInfo;
    //const params = useParams();
    //const articleId  = params.articleId;
    const { articleId } = useParams();

    const { user, isLoading } = useUser();
    console.log('vmro');

    useEffect(() => {
        const loadArticleInfo = async () => {
            const token = user && await user.getIdToken();
            const headers = token ? { authtoken: token } : {};
            const response = await axios.get(`/api/articles/${articleId}`, { headers });
            const newArticleInfo = response.data;
            setArticleInfo(newArticleInfo);
            //console.log('upvote is:' + {newArticleInfo.canUpvote} )
            //console.log(upInfo.toString());
        }

        if (!isLoading) {
            loadArticleInfo();
        }
    }, [isLoading, user, articleId]);

    const article = articles.find(article => article.name === articleId);

    const addUpvote = async () => {
        const token = user && await user.getIdToken();
        const headers = token ? { authtoken: token } : {};
        const response = await axios.put(`/api/articles/${articleId}/upvote`, null, { headers });
        const updatedArticle = response.data;
        setArticleInfo(updatedArticle);
    }

    if (!article) {
        return <NotFoundPage />
    }

    return (
        <>
            <h1>{article.title}</h1>
            <p>statuesUpdate: {canUpvote ? 'true' : 'false'}</p>
            <p>isLoading: {isLoading ? 'true' : 'false'}</p>
            <div className="upvotes-section">
                {user
                    ? <button onClick={addUpvote}>{canUpvote ? 'Upvote' : 'Already Upvoted'}</button>
                    : <button>Login to upvote</button>}
                <p>This article has {articleInfo.upvotes} upvote(s)</p>
            </div>
            {article.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
            ))}
            {user
                ? <AddCommentForm
                    articleName={articleId}
                    onArticleUpdated={updatedArticle => setArticleInfo(updatedArticle)} />
                : <button>Log in to add a commnet</button>}
            <CommentsList comments={articleInfo.comments} />
        </>

    );
}

export default ArticlePage;