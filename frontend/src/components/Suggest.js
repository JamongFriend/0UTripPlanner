import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/Suggest.css'

function Suggest() {
    const [suggestionData, setSuggestionData] = useState({
        placeList: [],
        hotelList: [],
        restaurantList: []
    });

    useEffect(() => {
        const fetchSuggestList = async () => {
            try {
                const response = await axios.get('/backend/routes/suggest/suggest');
                setSuggestionData({
                    placeList: response.data.places || [],
                    hotelList: response.data.hotels || [],
                    restaurantList: response.data.restaurants || []
                });
            }
            catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchSuggestList();
    }, []);

    return (
        <div className='suggest_trip_place_wrap'>
            <div className='suggest_trip_place_outLineBox'>
                <div className='suggest_trip_place_content'>
                    <div className='contentBox'>
                        <div className='suggest_place_wrap'>
                            <div className='suggest_content_title'>
                                <div className='suggest_place_title'>여행지</div>
                            </div>
                            <div className='suggest_place_list'>
                                <ul>
                                    {suggestionData.placeList.map((place, index) => (
                                        <li key={index}>{place.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <hr/>
                        <div className='suggest_hotel_wrap'>
                            <div className='suggest_content_title'>
                                <div className='suggest_hotel_title'>숙소</div>
                            </div>
                            <div className='suggest_hotel_list'>
                                <ul>
                                    {suggestionData.placeList.map((hotel, index) => (
                                        <li key={index}>{hotel.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <hr/>
                        <div className='suggest_restaurant_wrap'>
                            <div className='suggest_content_title'>
                                <div className='suggest_restaurant_title'>식당</div>
                            </div>
                            <div className='suggest_restaurant_list'>
                                <ul>
                                    {suggestionData.placeList.map((restaurant, index) => (
                                        <li key={index}>{restaurant.name}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Suggest;