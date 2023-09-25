import { useState, useRef, useEffect, useReducer } from "react";
import {db} from '../firebaseInit';
import { doc, collection, addDoc, getDocs, onSnapshot, deleteDoc } from "firebase/firestore"; 


function blogsReducer(state, action){
    switch(action.type){
        case "ADD":
                return [action.blog, ...state];
        case "REMOVE":
                return state.filter((blog, index) => index !== action.index);
        default: 
            return [];
    }
}



//Blogging App using Hooks

export default function Blog(){
    
    // const [title, setTitle] = useState("");
    // const [content, setContent] = useState("");
    const [formData, setFormData] = useState({title: "", content: ""})

    const [blogs, setBlogs] = useState([]);
    // const [blogs, dispatch] = useReducer(blogsReducer, []);
    const titleRef = useRef(null);

    // equivent to componentDidMount() from class component
    useEffect(() => {
        // initially focus on title input field
        titleRef.current.focus();
    },[]);

    useEffect(() => {
        if(blogs.length && blogs[0].title){
            document.title = blogs[0].title;
        }else{
            document.title = "No Blogs!!";
        }
    }, [blogs]);



    useEffect(() => {
        // async function fetchData(){
        //    const snapShot = await getDocs(collection(db, "blogs"));
        //    console.log(snapShot);

        //    const blogs = snapShot.docs.map((doc) => {
        //         return{
        //             id: doc.id,
        //             ...doc.data()
        //         }
        //    })
        //    console.log(blogs);
        //    setBlogs(blogs);
        // // dispatch({ type: "ADD", blogs });
        // }
        // fetchData();


        const unsub = onSnapshot(collection(db, 'blogs'), (snapShot) => {
            // realtime update in db using onSnapshot
            const blogs = snapShot.docs.map((doc) => {
                        return{
                            id: doc.id,
                            ...doc.data()
                        }
                   })
            console.log(blogs);
            setBlogs(blogs);
        // dispatch({ type: "ADD", blogs });
        })
    }, []);

    //Passing the synthetic event as argument to stop refreshing the page on submit
    async function handleSubmit(e){
        e.preventDefault();

        setBlogs([{title: formData.title, content: formData.content}, ...blogs]);
        // dispatch({type: "ADD", blog: {title: formData.title, content: formData.content}})


        // Add a new document with a generated id.
        const docRef = await addDoc(collection(db, "blogs"), {
        title: formData.title,
        content: formData.content,
        createdOn: new Date()
        });
        console.log("Document written with ID: ", docRef.id);

// Add a new document with a generated id using --setDoc--
// --setDoc-- useful when we are generaing IDs
        // const docRef = doc(collection(db, "blogs"));
        // await setDoc(docRef, {
        //     title: formData.title,
        //     content: formData.content,
        //     createdOn: new Date()
        //     });


        setFormData({title: "", content: ""});
        // setTitle("");
        // setContent("");
        
        
        titleRef.current.focus();
        // console.log(blogs);
    }

    async function removeBlog(id){
        // setBlogs(blogs.filter((blog, index) => i !== index));
        // dispatch({type: "REMOVE", index: i})

       const docRef = doc(db, 'blogs', id);
       await deleteDoc(docRef);
    }

    return(
        <>
        {/* Heading of the page */}
        <h1>Write a Blog!</h1>

        {/* Division created to provide styling of section to the form */}
        <div className="section">

        {/* Form for to write the blog */}
            <form onSubmit={handleSubmit}>

                {/* Row component to create a row for first input field */}
                <Row label="Title">
                        <input className="input"
                                placeholder="Enter the Title of the Blog here.."
                                // value = {title}
                                // onChange = {(e) => setTitle(e.target.value)}  
                                value = {formData.title}
                                onChange={(e) => setFormData({title: e.target.value, content: formData.content})}   
                                ref = {titleRef}  
                        />
                </Row >

                {/* Row component to create a row for Text area field */}
                <Row label="Content">
                        <textarea className="input content"
                                placeholder="Content of the Blog goes here.."
                                // value = {content}  
                                // onChange = {(e) => setContent(e.target.value)} 
                                value = {formData.content}
                                onChange = {(e) => setFormData({content:e.target.value, title:formData.title})}  
                                required       
                        />
                </Row >

                {/* Button to submit the blog */}            
                <button className = "btn">ADD</button>
            </form>
                     
        </div>

        <hr/>

        {/* Section where submitted blogs will be displayed */}
        <h2> Blogs </h2>
        {/* <h3>{title}</h3>
        <p>{content}</p> */}

        {/* <h3>{formData.title}</h3>
        <p>{formData.content}</p> */}

        {blogs.map((blog, i) => (
            <div className="blog" key={i}>
                {blog ? (
                    <>
                        <h3>{blog.title}</h3>
                        <p>{blog.content}</p>    

                        <div className="blog-btn">
                            <button onClick={() => removeBlog(blog.id)} className="btn remove">
                                Delete
                            </button>
                        </div>
                    </>
                ) : (
                    // Handle the case where blog is undefined (optional)
                <p>This blog is undefined.</p>
                )}
            </div>
        ))}
        </>
    )
}

//Row component to introduce a new row section in the form
function Row(props){
    const{label} = props;
    return(
        <>
        <label>{label}<br/></label>
        {props.children}
        <hr />
        </>
    )
}
