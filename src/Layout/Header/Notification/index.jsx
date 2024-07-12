import React, { useState, useEffect, useRef, Fragment } from "react";
import { Bell } from "react-feather";
import { toast } from "react-toastify";
import { StatusCodes } from "http-status-codes";
import { useNavigate } from "react-router-dom";
import { notificationLable } from "../../../Constant/common";
import { listOfNotificationApi, markAsReadApi, clearNotificationApi } from "../../../Api/NotificationApi";
import '../../../assets/css/notification.css';
import BaseModal from "../../../BaseComponents/BaseModal";


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [infiniteScrollEnabled, setInfiniteScrollEnabled] = useState(false);
  const [noNotification, setNoNotification] = useState(false);
  const notificationsPerPage = 3;
  const observer = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await listOfNotificationApi();
      const data = response.data;
      if (data.length === 0) {
        setNoNotification(true);
        setHasMore(false);
      } else {
        setNotifications(data);
        setDisplayedNotifications(data.slice(0, notificationsPerPage));
        setHasMore(data.length > notificationsPerPage);
      }
    } catch (error) {
      setNoNotification(true);
    } finally{
      setLoading(false);
    }
  };

  const loadMoreNotifications = () => {
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * notificationsPerPage;
      const newNotifications = notifications?.slice(startIndex, startIndex + notificationsPerPage);

      setDisplayedNotifications((prev) => [...prev, ...newNotifications]);
      setHasMore(notifications?.length > startIndex + notificationsPerPage);
      setPage(nextPage);
      setLoading(false);
    }, 1000);
  };

  const handleMarkAsRead = async (notification) => {
    const response = await markAsReadApi({ id: [notification.id] });
    if (
      response?.statusCode === StatusCodes.ACCEPTED ||
      response?.statusCode === StatusCodes.OK ||
      response?.statusCode === StatusCodes.CREATED
    ) {
      setNotifications(notifications?.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
      setDisplayedNotifications(displayedNotifications?.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
      toast.success(response?.message);
    } else {
      toast.error(response?.message);
    }
  };

  const openModal = (notification) => {
    setNotificationToDelete(notification);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (notificationToDelete) {
      const payload = { id: [notificationToDelete.id] };
      const response = await clearNotificationApi({ payload });
      if (
        response?.statusCode === StatusCodes.ACCEPTED ||
        response?.statusCode === StatusCodes.OK ||
        response?.statusCode === StatusCodes.CREATED
      ) {
        setNotifications(notifications?.filter(n => n.id !== notificationToDelete?.id));
        setDisplayedNotifications(displayedNotifications?.filter(n => n.id !== notificationToDelete?.id));
        toast.success(notificationLable.toastMessage);
      } else {
        toast.error(response?.message);
      }
      setShowModal(false);
    }
  };

  const handleSeeMoreClick = () => {
    setInfiniteScrollEnabled(true);
    loadMoreNotifications();
  };

  const handleViewAllClick = (e) => {
    e.preventDefault();
    navigate('/allnotificationlist');
  };

  const resetState = () => {
    setInfiniteScrollEnabled(false);
    setPage(1);
    setDisplayedNotifications(notifications?.slice(0, notificationsPerPage));
    setHasMore(notifications?.length > notificationsPerPage);
  };

  const handleNavigate = () => {
    navigate('/allnotificationlist');
  }

  useEffect(() => {
    if (!infiniteScrollEnabled || loading) return;
    if (observer.current) observer.current.disconnect();
    if ('IntersectionObserver' in window) {
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreNotifications();
        }
      });
      if (observer.current && document.querySelector(".notification-list")) {
        observer.current.observe(document.querySelector(".notification-list ul li:last-child"));
      }
    }
  }, [loading, hasMore, infiniteScrollEnabled]);

  const handleNotificationClick = (notification) => {
    switch (notification) {
      case 'Bill':
        navigate('/bill');
        break;
      case 'Accreditation':
        navigate('/accreditation');
        break;
      case 'Tot':
        navigate('/tot');
        break;
      default:
        navigate('/allnotificationlist');
    }
  };

  return (
    <Fragment>
      <li className="onhover-dropdown" onMouseLeave={resetState}>
        <div className="notification-box">
          <i>
            <Bell />
          </i>
          <span className="badge rounded-pill badge-primary">
            {notifications.length}
          </span>
        </div>
        <div className="notification-dropdown onhover-show-div">
          <div className="m-3 text-center">
            <span className="btn btn-dark w-100 text-center" onClick={() => handleNavigate()}>
              <div className="text-center">You have {notifications?.length} reminders</div>
            </span>
          </div>
          {!noNotification && 
            <div className="notification-list">
              <ul className="border-top border-secondary custom-scrollbar">
                {displayedNotifications?.map((notification) => (
                  <li key={notification.id} className="border-bottom pb-4">
                    <div className="media">
                      <div className="text-justify">
                        <span 
                          onClick={(e) => {
                            e.preventDefault();
                            handleNotificationClick(notification?.moduleName);
                          }}>
                          {notification.message}
                        </span>
                        <div className="icon-container">
                          <span className="mark-read-icon" title="Mark as Read" onClick={() => handleMarkAsRead(notification)}>
                            <i className="me-1 large icofont icofont-inbox text-primary"></i>
                          </span>
                        </div>
                        <div className="icon-container2">
                          <span className="delete-icon" title="Delete Notification" onClick={() => openModal(notification)}>
                            <i className="me-2 icofont icofont-trash text-danger"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {loading && (
                <div className="loader-spinner">
                  <div className="notification-loader"></div>
                </div>
              )}
            </div>
          }
          {!loading && hasMore && !infiniteScrollEnabled && !noNotification && (
            <div className="m-3 mt-1">
              <button className="btn btn-primary w-100" onClick={handleSeeMoreClick}>
              {notificationLable.seeMore}
              </button>
            </div>
          )}
          {!noNotification && (
            <div className="m-3 mt-1">
              <button className="btn btn-light w-100 no-radius" onClick={handleViewAllClick}>
                {notificationLable.viewAll}
              </button>
            </div>
          )}
        </div>
      </li>
      {showModal && (
        <BaseModal
          showModal={showModal}
          handleClose={() => setShowModal(false)}
          handleDelete={handleDelete}
        />
      )}
    </Fragment>
  );
};

export default Notification;