import React, { useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { BOATS_NEAR_YOU_LISTING_TYPE } from '../../../constants/home';
import LocationBasedHeader from '../LocationBasedHeader';
import BoatNearYou from '../BoatNearYou';
import LoadingListingList from '../../../components/ListingList/LoadingListingList';
import { getBoatsNearYou } from '../../../store/actions';
import * as types from '../../../store/constants';
import './styles.css';


const boatsNearYouActionFailure = (err, statusCode) => ({
  type: types.GET_DATA_FAILURE,
  success: false,
  statusCode: statusCode,
  message: err,
  data: []
});

const boatsNearYouAction = (data, statusCode) => {
  return {
    type: types.GET_DATA_SUCCESS,
    success: true,
    statusCode: statusCode,
    data: data
  };
};


const LoadingBoatNearYouList = ({numListings = undefined}) => {

  return (
    <>
      <LocationBasedHeader>Boats Near You</LocationBasedHeader>
      <LoadingListingList number={numListings || 12}/>
    </>
  );
};

const BoatNearYouList = ({listings, cookies }) => {
  if ( !Array.isArray(listings) || listings.length === 0) { return null; }
  return (
    <>
      <LocationBasedHeader>Boats Near You</LocationBasedHeader>
      <ol className="boat-list">
        {
          listings.map( (listing) => {
            return (
              <>
                <li
                  key={listing.id}
                  data-reporting-impression-product-id={listing.id}
                  data-reporting-impression-listing-type={BOATS_NEAR_YOU_LISTING_TYPE}
                >
                  <BoatNearYou cookies={cookies} listing={ listing } />
                </li>
              </>
            );
          })
        }
      </ol>
    </>
  );
};

const BoatsNearYou = ({cookies, coordinates} ) => {
  const [boatsNearYou, setBoatsNearYou] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    const getAllBoats = async (coordinates) => {
      if (coordinates.length === 0){
        setLoading(false);
        return;
      }
      const params = { coordinates: coordinates.join(',') };
      const response = await getBoatsNearYou(params);

      if (response.error){
        dispatch(boatsNearYouActionFailure(response.error, response.statusCode));
        setLoading(false);
        return;
      }
      let boats = response;
      setBoatsNearYou(boats);
      dispatch(boatsNearYouAction(boats));
      setLoading(false);
    };
    getAllBoats(coordinates);
  }, []);

  return (
    <div className="recommended-boats">
      { loading ?
        <LoadingBoatNearYouList /> :
        <BoatNearYouList listings={boatsNearYou} cookies={cookies} />
      }
    </div>
  );
};

export default BoatsNearYou;

