import { notFound } from "../../Constant";

const NoResultsMessage = () => {
    return (
        <div className="py-4 text-center">
            <div>
                <i className="ri-search-line display-5 text-success"></i>
            </div>

            <div className="mt-4">
                <h5>{notFound.dataNotFound}</h5>
            </div>
        </div>
    );
};

export default NoResultsMessage;