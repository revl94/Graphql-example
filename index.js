const express = require('express');
const app = express();

const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// data

const { courses } = require('./data.json')

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
    }

    type Mutation {
        updateCourseTopic(id: Int!, topic: String!): Course
    }

    type Course {
        id: Int
        title: String
        description: String
        author: String
        topic: String
        url: String
    }
`);

let getCourse = (args) => {
    let id = args.id
    return courses.filter(course => {
        return course.id == id;
    })[0]
};

let getCourses = (args) => {

    if (args.topic) {
        let topic = args.topic;
        return courses.filter(course => course.topic === topic)
    } else {
        return courses
    }
;}

let updateCourseTopic = ({id, topic}) => {
    courses.map(course => {
        if (course.id === id) {
            course.topic = topic;
            return course;
        }
    })
    return courses.filter(course => course.id === id)[0]
}

const root = {
    course: getCourse,
    courses: getCourses,
    updateCourseTopic: updateCourseTopic
}

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(3000, () => console.log('Server on port 3000'))


// Query examples
// query getSingleCourse($courseId: Int!) {
//       course(id: $courseId) {
        
//         title
//         author
//         description
//         topic
//         url
        
//       }
//     }
    
//     query getCourses($topic: String!) {
//       courses(topic: $topic) {
        
//         title
//         author
//         description
//         topic
//         url
//       }
//     }
    
//     #query getCoursesWithFragments($courseId1: Int!, $courseId2: Int!) {
//       course1: course(id: $courseId1) {
//         ...courseField
//       }
      
//       course2: course(id: $courseId2) {
//         ...courseField
//       }
//     }
    
//     mutation updateCourseTopic($id: Int!, $topic: String!) {
//       updateCourseTopic(id: $id, topic: $topic) {
//         ...courseField
//       }
//     }
    
// Fragment example
//     fragment courseField on Course {
//       title
//       author
//       description
//       topic
//       title
//       url
//     }


// Query varibales example
//     {
//         "id": 2,
//         "topic": "Javascript"
        
//       }