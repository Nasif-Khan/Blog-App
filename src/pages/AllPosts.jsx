import React, { useState, useEffect} from 'react'
import appwriteService from '../appwrite/storage'
import { Container, PostCard } from '../components'


function AllPosts() {
    const [posts, setPosts] = useState([])

    useEffect(() => {
        appwriteService.getPosts().then((posts) => {
            if (posts) {
                console.log(posts);
                setPosts(posts.documents);
            }
        }).catch(error => console.error("Failed to fetch posts:", error));
    }, []);
    
  return (
    <div className='w-full py-8'>
        <Container>
            <div className='flex flex-wrap'>
                {posts.map((post) => (
                    <div key={post.$id} className='p-2 w-1/4'>
                        <PostCard {...post} />
                    </div>
                ))}
            </div>
        </Container>
                
    </div>
  )
}

export default AllPosts