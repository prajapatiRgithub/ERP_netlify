import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { notificationLable } from "../../Constant/common";
import { toast } from "react-toastify";
import BaseModal from "../../BaseComponents/BaseModal";
import {
  listOfNotificationApi,
  markAsReadApi,
  clearNotificationApi,
} from "../../Api/NotificationApi";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import BaseCheckbox from "../../BaseComponents/BaseCheckbox";
import "../../assets/css/notification.css";
import { StatusCodes } from "http-status-codes";
import Spinner from "../../BaseComponents/BaseLoader";
import { Deselect_all, Select_all } from "../../Constant/common";
import { useNavigate } from "react-router-dom";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [selectedNotifications, setSelectedNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [noNotification, setNoNotifications] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const listRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchNotifications() {
      setIsLoading(true);
      try {
        const response = await listOfNotificationApi();
        setNotifications(response?.data);
      } catch (error) {
        setNoNotifications(true);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const openModal = (notification) => {
    setNotificationToDelete(notification);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (notificationToDelete) {
      const payload = { id: [notificationToDelete.id] };
      clearNotificationApi({ payload })
        .then((response) => {
          if (
            response?.statusCode === StatusCodes.ACCEPTED ||
            response?.statusCode === StatusCodes.OK ||
            response?.statusCode === StatusCodes.CREATED
          ) {
            setNotifications(
              notifications?.filter((n) => n.id !== notificationToDelete.id)
            );
            toast.success(notificationLable.toastMessage);
          } else {
            toast.error(response.message);
          }
          setShowModal(false);
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message || err?.message);
        })
        .finally(() => {
          setShowModal(false);
        });
    }
  };

  const handleClearSelected = async () => {
    const payload = { id: selectedNotifications };
    clearNotificationApi(payload)
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setNotifications(
            notifications?.filter((n) => !selectedNotifications.includes(n.id))
          );
          setSelectedNotifications([]);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      });
  };

  const handleMarkAsRead = async (notification) => {
    markAsReadApi({ id: [notification.id] })
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setNotifications(
            notifications?.map((n) =>
              n.id === notification.id ? { ...n, is_read: true } : n
            )
          );
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      });
  };

  const handleSelectNotification = (id) => {
    setSelectedNotifications((prevSelected) => {
      if (prevSelected?.includes(id)) {
        return prevSelected?.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications?.length === notifications?.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(
        notifications?.map((notification) => notification.id)
      );
    }
  };

  const handleMarkSelectedAsRead = async () => {
    markAsReadApi({ id: selectedNotifications })
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setNotifications(
            notifications?.map((n) =>
              selectedNotifications?.includes(n.id) ? { ...n, is_read: true } : n
            )
          );
          setSelectedNotifications([]);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      });
  };

  const handleMarkAllAsRead = async () => {
    const allIds = notifications?.map((n) => n.id);
    markAsReadApi({ id: allIds })
      .then((response) => {
        if (
          response?.statusCode === StatusCodes.ACCEPTED ||
          response?.statusCode === StatusCodes.OK ||
          response?.statusCode === StatusCodes.CREATED
        ) {
          setNotifications(
            notifications?.map((n) => ({ ...n, is_read: true }))
          );
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.message);
      });
  };

  const handleClearAll = async () => {
    const allIds = notifications?.map((n) => n.id);
    clearNotificationApi({ id: allIds }).then((response) => {
      if (
        response?.statusCode === StatusCodes.ACCEPTED ||
        response?.statusCode === StatusCodes.OK ||
        response?.statusCode === StatusCodes.CREATED
      ) {
        setNotifications([]);
        toast.success(response?.message);
      } else {
        toast.error(response?.message);
      }
    })
    .catch((err) => {
      toast.error(err?.response?.data?.message || err?.message);
    });
  };

  const handleNotificationClick = (notification) => {
    switch (notification) {
      case "Bill":
        navigate("/bill");
        break;
      case "Accreditation":
        navigate("/accreditation");
        break;
      case "Tot":
        navigate("/tot");
        break;
      default:
        navigate("/allnotificationlist");
    }
  };

  const toggleDropdown = () => setDropdownOpen((prevState) => !prevState);

  return (
    <>
      <div className="row mb-4 mt-4">
        <div className="col-6">
          <h5 className="f-w-600">{notificationLable.allNotification}</h5>
        </div>
        <div className="col-6 text-end">
          <Dropdown
            isOpen={dropdownOpen}
            toggle={toggleDropdown}
            className="text-end rounded"
          >
            <DropdownToggle caret className="rounded-pill">
              {notificationLable.Action}
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={() => window.location.reload()}>
                {notificationLable.refresh}
              </DropdownItem>
              <DropdownItem onClick={handleSelectAll}>
                {selectedNotifications?.length === notifications?.length
                  ? Deselect_all
                  : Select_all}
              </DropdownItem>
              <DropdownItem onClick={handleMarkAllAsRead}>
                {notificationLable.markAllAsRead}
              </DropdownItem>
              <DropdownItem onClick={handleClearAll}>
                {notificationLable.clearAll}
              </DropdownItem>
              <DropdownItem
                onClick={handleMarkSelectedAsRead}
                disabled={selectedNotifications.length === 0}
              >
                {notificationLable.markSelectedRead}
              </DropdownItem>
              <DropdownItem
                onClick={handleClearSelected}
                disabled={selectedNotifications.length === 0}
              >
                {notificationLable.clearSelected}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-body pt-0 mt-3">
          <div className="todo">
            <div className="todo-list-wrapper">
              <div className="todo-list-container">
                <div className="todo-list-body">
                  <ul id="todo-list" ref={listRef}>
                    {notifications?.map((notification) => (
                      <li
                        key={notification.id}
                        id={`notification-${notification.id}`}
                        className="task"
                      >
                        <div className="task-container task-div">
                          <span className="task-action-btn text-start">
                            <BaseCheckbox
                              id={`notification-checkbox-${notification.id}`}
                              checked={selectedNotifications.includes(
                                notification.id
                              )}
                              onChange={() =>
                                handleSelectNotification(notification.id)
                              }
                            />
                          </span>
                          <span
                            className="mt-2"
                            onClick={(e) => {
                              e.preventDefault();
                              handleNotificationClick(notification?.moduleName);
                            }}
                          >
                            <Link
                              className="text-dark align-bottom"
                              to={notification.link}
                            >
                              {notification.message}
                            </Link>
                          </span>
                          <span className="notification-icon">
                            <span
                              className="action-box large delete-btn"
                              title="Mark as read"
                              onClick={() => handleMarkAsRead(notification)}
                            >
                              <i className="icon">
                                <i className="icofont icofont-inbox text-primary"></i>
                              </i>
                            </span>
                            <span
                              className="action-box large delete-btn"
                              title="Delete Notification"
                              onClick={() => openModal(notification)}
                            >
                              <i className="icon">
                                <i className="icofont icofont-trash text-danger"></i>
                              </i>
                            </span>
                          </span>
                        </div>
                      </li>
                    ))}
                    {noNotification && (
                      <li>
                        <div className="task-container text-center">
                          <p>{notificationLable.noNotification}</p>
                        </div>
                      </li>
                    )}
                  </ul>
                  {isLoading && (
                    <Spinner attrSpinner={{ className: "loader-2" }} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <BaseModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default NotificationList;
