const express = require('express');
const Posts = require('../data/db');

const router = express.Router();

router.use(express.json());

//  GET posts         >>>         Working
router.get('/', (req, res) => {
    Posts.find(req.query)
    .then(posts => {
        res.status(200)
            .json(posts)
    })
    .catch(err => {
        console.log('error with GET /', err)
        res.status(500)
            .json({ errorMessage: 'error retrieving the posts'})
    });
});

//  GET specified post         >>>         Working
router.get('/:id', (req, res) => {
    Posts.findById(req.params.id)
    .then(post => {
        if (post) {
            res.status(200)
                .json(post)
        } else {
            res.status(404)
                .json({ errorMessage: 'The post with the specified ID does not exist' })
        }
    })
    .catch(err => {
        console.log('error getting specified post', err)
        res.status(500)
            .json({ errorMessage: 'The post information could not be retrieved' })
    });
});

//  *SUB-GET* specified post's comments         >>>         Working
router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
    .then(comments => {
        if (comments) {
            res.status(200)
                .json(comments)
        } else {
            res.status(404)
                .json({ errorMessage: 'The post with the specified ID does not exist' })
        }
    })
    .catch(err => {
        console.log('error with /:id/comments GET', err)
        res.status(500)
            .json({ errorMessage: 'The comments information could not be retrieved' })
    });
});

//  POST create post         >>>         Working
router.post('/', (req, res) => {
    Posts.insert(req.body)
    .then(post => {
        if (post) {
            res.status(201)
                .json(post)
        } else {
            res.status(400)
                .json({ errorMessage: 'please provide title and contents for the post'})
        }
    })
    .catch(err => {
        console.log('error with POSTing new post', err)
        res.status(500)
            .json({ errorMessage: 'There was an error while saving the post to the database' })
    });
});

//  *SUB-POST* create comment         >>>         Working
router.post('/:id/comments', (req, res) => {
    const {text} = req.body
    if (text) {
        Posts.insertComment(req.body)
        .then(comment => {
            if (comment) {
                res.status(201)
                .json(comment)
            } else {
                res.status(404)
                .json({ errorMessage: 'the post with the specified ID does not exist' })
            }
        })
        .catch(err => {
            console.log('error with POSTing new comment on post', err)
            res.status(500)
            .json({ errorMessage: 'error posting new comment' })
        });
    } else {
        res.status(400)
            .json({ errorMessage: 'Please provide text for the comment' })
    }
});

//  Put update post         >>>         Working
router.put('/:id', (req, res) => {
    const changes = req.body;
    const {title, contents} = req.body
    if (title, contents) {
        Posts.update(req.params.id, changes)
        .then(post => {
            if (post) {
                res.status(200)
                .json(post)
            } else {
                res.status(404)
                .json({ errorMessage: 'The post with the specified ID does not exist' })
            }
        })
        .catch(err => {
            console.log('error with PUT to update post')
            res.status(500)
            .json({ errorMessage: 'The post information could not be modified' })
        });
    } else {
        res.status(400)
            .json({ errorMessage: 'Please provide title and contents for the post' })
    }
});

//  DELETE post         >>>         Working
router.delete('/:id', (req, res) => {
    Posts.remove(req.params.id)
    .then(count => {
        if (count > 0) {
            res.status(200)
                .json({ message: 'the post has been removed' })
        } else {
            res.status(404)
                .json({ errorMessage: 'The post with the specified ID does not exist' })
        }
    })
    .catch(err => {
        console.log('error with DELETEing a post')
        res.status(500)
            .json({ errorMessage: 'The post could not be removed' })
    });
});

module.exports = router;