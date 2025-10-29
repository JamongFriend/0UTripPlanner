import React, {useEffect} from 'react';
import '../css/Map.css';

function Map() {
    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
        const mapContainer = document.getElementById('map');
        const mapOption = {
            center: new window.kakao.maps.LatLng(33.450701, 126.570667),
            level: 3,
        };
        new window.kakao.maps.Map(mapContainer, mapOption);
        }
    }, []);
    return(
        <div className='map_wrap'>
            <div className='map_outLineBox'>
                <div className='map_content'>
                    <div id="map"></div>
                </div>
            </div>
        </div>
    );
}

export default Map;