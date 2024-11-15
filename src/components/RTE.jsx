import React from "react"
import { Editor } from "@tinymce/tinymce-react"
import { Controller } from "react-hook-form"

export default function RTE({name, control, label, defaultValue=""}) {
    const tinymceApiKey = import.meta.env.VITE_RTE_API_KEY
    console.log(tinymceApiKey)
    return (
        <div className="w-full">
            {label && <label className="inline-block mb-1 pl-1">
                {label}
                </label>}
            
            <Controller
                name = {name || "content"}
                control={control}
                // field  tracking on the event  => jo bhi element render krwana hai 
                // is field mei kuch bhi change ho toh inform kr dena render ke sath

                // Changed to resolve error
                render={({ field }) => (
                    <Editor
                    apiKey={tinymceApiKey}
                    initialValue={defaultValue}
                    init={{
                        initialValue    : defaultValue,
                        height: 500,
                        menubar: true,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount anchor'
                        ],
                        toolbar: "undo redo | blocks | image | bold italic forecolor | alignleft aligncenter bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                        content_style : "body { font-family: 'Roboto', sans-serif; font-size: 14px; }",
                    }}
                    // onEditorChange={onChange}
                    // Changed to resolve error
                    onEditorChange={(content) => {
                        field.onChange(content); // Update form field value
                    }}
                    />
                )}
            />
            
        </div>
    )
}