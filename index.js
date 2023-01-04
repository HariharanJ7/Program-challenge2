const fastify = require('fastify');

const app = fastify({ logger: true });

const students = require('./students.json');

app.register(require('fastify-formbody'));

app.get('/getStudents',(request, reply) => {
	return students;
});

app.get('/getStudents/:studentID',(request, reply) => {
	const id = parseInt(request.params.id, 10)

	const user = students.find((user) => user.id === id)

	return (
		user ||
		reply.status(404).send({
			msg: 'User not found',
		})
	)
});

const addUserOptions = {
	schema: {
		body: {
			type: 'object',
			properties: {
				studentName: {
					type: 'string',
				},
				subject1: {
					type: ['number'],
				},
                subject2: {
					type: ['number'],
				},
                subject3: {
					type: ['number'],
				},
                subject4: {
					type: ['number'],
				},
                subject5: {
					type: ['number'],
				},
				studentID: {
					type: 'string',
				}
			},
			required: ['studentName'],
		},
	},
	handler: (request) => {
        const id = students.length + 1;
		
        const newStudents = { ...request.body, id };
		
        students.push(newStudents);
    
        return newStudents;
    },
}

app.post('/addStudent', addUserOptions);

const deletePostSchema = {
    params: {
      id: { type: 'number' },
    },
};

const deletePostHandler = (req, reply) => {
    const { id } = req.params;
  
    const postIndex = students.findIndex((post) => {
      return post.id === id;
    });
  
    if (postIndex === -1) {
      return reply.status(404).send(new Error("Student doesn't exist"));
    }
  
    students.splice(postIndex, 1);
  
    return reply.send('Post deleted');
};

const deletePostOpts = {
    schema: deletePostSchema,
    handler: deletePostHandler,
};

app.delete('/addStudent/:id', deletePostOpts);

const PORT = process.env.PORT || 8000;

app.listen(PORT).catch((error) => {
	app.log.error(error);
	process.exit();
});