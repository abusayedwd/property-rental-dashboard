import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaCircleArrowLeft } from "react-icons/fa6";
import { Button, Form, notification } from "antd";
 
import toast, { Toaster } from "react-hot-toast";
import { useTermsConditionQuery } from "../../../redux/features/information/getTermsCondition";
import { useUpdateTermsMutation } from "../../../redux/features/information/editTermsCondition";

// import Swal from "sweetalert2";
const decodeHtml = (html) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
};

const EditTermCondition = () => {
  const { data: termcondition } = useTermsConditionQuery();

  const [updateTC, { isLoading }] = useUpdateTermsMutation();

  const editor = useRef(null);
  const [content, setContent] = useState(" ");
  const navigate = useNavigate();
  useEffect(() => {
    if (termcondition) {
      // Decode the HTML content before setting it
      const decodedContent = decodeHtml(termcondition.data.attributes?.text);
      setContent(decodedContent);
    }
  }, [termcondition]);

  const dataContent = {
    text: content,
  };

  const handleEditTermCondition = async () => {
    try {
      const res = await updateTC(dataContent).unwrap();
      // console.log(res)
      if (res?.code == 200) {
        toast.success(res?.message);
      }
      setTimeout(() => {
        navigate("/dashboard/settings/termcondition");
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-8 mx-6">
      <Toaster position="top-center" reverseOrder={false} />
      <Link
        to="/dashboard/settings/termcondition"
        className="flex items-center gap-2"
      >
        <FaCircleArrowLeft className=" !text-primaryBg w-8 h-8" />
        <p className=" font-semibold text-[30px]">Edit Term&Condition</p>
      </Link>
      <Form
        labelCol={{ span: 22 }}
        wrapperCol={{ span: 40 }}
        layout="vertical"
        initialValues={{
          remember: true,
        }}
        onFinish={handleEditTermCondition}
      >
        <div className="mt-6">
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => {
              setContent(newContent);
            }}
          />
        </div>
        <div className="text-right mt-6">
          <Form.Item>
            <Button
              htmlType="submit"
              className=" h-[44px] w-[260px] !text-whiteText !bg-primaryBg rounded-[8px]"
            >
              Update termCondition
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};

export default EditTermCondition;
