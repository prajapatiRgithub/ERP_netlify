import { Col, Form, Label } from "reactstrap";
import Dropzone from "react-dropzone-uploader";
import { useState } from "react";
import { categoryLable } from "../../Constant/Category/category";

const BaseDropzone = ({ handleChangeStatus, label }) => {
  const [error, setError] = useState(null);
  const maxSize = 1024 * 1024;

  const handleChange = (file) => {
    if (file?.file?.size > maxSize) {
      setError(categoryLable.sizeError);
    } else {
      setError(null); 
      handleChangeStatus(file);
    }
  };

  return (
    <Col xs="12">
      <Form>
        <div className="dz-message needsclick">
          <Label>{label}</Label>
          <Dropzone
            onChangeStatus={handleChange}
            multiple={true}
            canCancel={true}
            accept="image/*"
            styles={{
              dropzone: { height: 75 },
              dropzoneActive: { borderColor: "green" },
            }}
          />
          {error && <div className="text-danger">{error}</div>}
        </div>
      </Form>
    </Col>
  );
};

export default BaseDropzone;
