/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import { Modal } from "bootstrap";
import "../../css/student.css";
import { useNavigate } from "react-router-dom";
const DayCardCompornant = () => {
  const modalRef = useRef(null);
  const [selectedDay, setSelectedDay] = useState('');
  const [bsModal, setBsModal] = useState(null); // State to store the modal instance

  const [day,setDay] = useState('');
  const [date,setDate] = useState(new Date());
  const [device,setDevice] = useState('1');


  const navigate = useNavigate();

  const showModal = (day) => {
    setSelectedDay(day);
    setDay(day);
    const modalElement = modalRef.current;
    const modalInstance = new Modal(modalElement);
    setBsModal(modalInstance); // Store the modal instance
    modalInstance.show();
  };

  const closeModal = () => {
    if (bsModal) {
      bsModal.hide(); // Call hide to close the modal
    }
  };

  const redirectToManageClass = (device) => {
    closeModal();
    navigate("/itexecutive/manage-class", {
      state: {
        day,
        date: new Date().toISOString(), // or format as needed
        device,
        fromDayCard: true // Add this flag to identify the navigation source
      }
    });
  }
  return (
    <>
      <div className="col-12 pt-4">
        <div className="row m-3 shadow p-4 rounded-3 mainDayDivColour">
          <p className="fw-bold fs-4">Class Days</p>

          <div className="col-12">
            <div className="row d-flex justify-content-center align-items-center">
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand mondayCardColour"
                onClick={() => showModal("Monday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Monday</p>
              </div>
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand tuesdayCardColour"
                onClick={() => showModal("Tuesday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Tuesday</p>
              </div>
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand wednesdayCardColour"
                onClick={() => showModal("Wednesday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Wednesday</p>
              </div>
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand thursdayCardColour"
                onClick={() => showModal("Thursday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Thursday</p>
              </div>
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand fridayCardColour"
                onClick={() => showModal("Friday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Friday</p>
              </div>
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand saturdayCardColour"
                onClick={() => showModal("Saturday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Saturday</p>
              </div>
              <div
                className="col-12 col-xl-3 shadow m-2 text-center pt-3 rounded-3 fw-semibold cursor-hand sundayCardColour"
                onClick={() => showModal("Sunday")}
                style={{ transition: "background-color 0.3s" }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
              >
                <p className="fs-5">Sunday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Model */}
      <div
        className="modal fade"
        id="exampleModal"
        ref={modalRef}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title fw-bold fs-4" id="exampleModalLabel">
                {selectedDay}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {/* Model Body */}
              {/* Device */}
              <div className="row m-3 shadow p-4 rounded-3 mainDayDivColour">
                <p className="fw-bold fs-5">Device No: 01</p>
                <div className="col-12">
                    {/* Device Name */}
                  <div onClick={()=>{redirectToManageClass("1")}}
                    className="col-12 shadow m-2 text-center pt-3 pb-1 rounded-3 fw-semibold cursor-hand saturdayCardColour"
                    style={{ transition: "background-color 0.3s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    <p className="fs-5">Lap 04</p>
                  </div>
                  {/* Device Name */}
                </div>
              </div>
              {/* Device */}
              {/* Device */}
              <div className="row m-3 shadow p-4 rounded-3 mainDayDivColour">
                <p className="fw-bold fs-5">Device No: 02</p>
                <div className="col-12">
                     {/* Device Name */}
                  <div onClick={()=>{redirectToManageClass("2")}}
                    className="col-12 shadow m-2 text-center pt-3 pb-1 rounded-3 fw-semibold cursor-hand saturdayCardColour"
                    style={{ transition: "background-color 0.3s" }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#d1e7dd"}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = ""}
                  >
                    <p className="fs-5">Lap 06</p>
                  </div>
                  {/* Device Name */}
                </div>
              </div>
              {/* Device */}
              {/* Model Body */}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Model */}
    </>
  );
};

export default DayCardCompornant;
