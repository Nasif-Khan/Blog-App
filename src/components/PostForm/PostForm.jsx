import React, {useCallback, useEffect} from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select, RTE } from "../index";
// appwriteService => storage.js  (StorageService)
import appwriteService from "../../appwrite/storage"
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// What is the purpose of this the post parameter?
// the post parameter is used to pass the post object to the PostForm component to get the values of the post
    function PostForm({post}) {
    // console.log("POST FORM COMPONENT " + post )
    // console.log(typeof post)
    // // console.log(post.featuredImage)
    const {register, handleSubmit, watch, setValue, control, getValues} = useForm({
        defaultValues:{
            title: post?.title || "",
            content: post?.content || "",
            slug: post?.slug || "",
            status: post?.status || "active",
        }
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)
    // comsole.log("this is the data " + userData)

    const submit = async (data) => {
        if(post){
            const file = data.image[0] ? await appwriteService.uploadFile(data.image[0]) : null

            if(file){
                appwriteService.deleteFile(post.featuredImage)
            }
            console.log(file)
            const dbPost =  await appwriteService.updatePost(post.$id, {...data, 
                featuredImage: file ? file.$id : undefined,
            })

            if(dbPost){
                navigate(`/post/${dbPost.$id}`)
            }
        }
        else{
            // TODO :: if else like above
            const file = await appwriteService.uploadFile(data.image[0])
            // console.log(file)
            if(file) {
                const fileId = file.$id
                data.featuredImage = fileId

                const dbPost = await appwriteService.createPost({...data,
                    userId: userData.$id
                 }) 

                 if(dbPost){
                        navigate(`/post/${dbPost.$id}`)
                 }
            }
        }
    }

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string") {
            return value
                .trim()
                .toLowerCase()
                .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and dashes
                .replace(/\s+/g, '-')      // Replace spaces with dashes
                .replace(/--+/g, '-')      // Replace multiple dashes with a single dash
                .replace(/^-+|-+$/g, '');  // Remove any leading or trailing dashes
        }
        return "";
    }, []);

    // interview question
    // useEffect mei ek  method call ko optimize kaise kara
    // method ko variable mei store karo, aur return mei callback mei unsubscribe kar do

    useEffect(() => {
        const subscription = watch((value, {name}) => {
            if(name === "title"){
                setValue("slug", slugTransform(value.title, {shouldValidate: true}))
            }
        })

        // optimization 
        return () => {
            subscription.unsubscribe()
        }
    }, [watch, slugTransform, setValue])

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    readOnly
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    // additional
                    value={watch("slug")}
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                    
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}

export default PostForm;