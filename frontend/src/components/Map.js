import React, { useEffect, useState } from 'react';
import '../css/Map.css';

function Map() {
    const [map, setMap] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if (window.kakao && window.kakao.maps) {
            const mapContainer = document.getElementById('map');
            const centerPos = new window.kakao.maps.LatLng(33.450701, 126.570667);
            
            const mapOption = {
                center: centerPos,
                level: 3,
            };
            
            const newMap = new window.kakao.maps.Map(mapContainer, mapOption);
            setMap(newMap); 

            setTimeout(() => {
                newMap.relayout();
                newMap.setCenter(centerPos);
            }, 0);
        }
    }, []);

    const searchPlaces = () => {
        if (!keyword.trim()) return alert("키워드를 입력해주세요!");
        if (!map) return;

        const ps = new window.kakao.maps.services.Places(); 
        ps.keywordSearch(keyword, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK) {
                setPlaces(data);
                
                const bounds = new window.kakao.maps.LatLngBounds();
                data.forEach(place => bounds.extend(new window.kakao.maps.LatLng(place.y, place.x)));
                map.setBounds(bounds);
            } else {
                alert("검색 결과가 없습니다.");
            }
        });
    };

    const moveSubLocation = (place) => {
        const { y, x, place_name } = place;
        const moveLatLon = new window.kakao.maps.LatLng(y, x);

        map.panTo(moveLatLon);

        const marker = new window.kakao.maps.Marker({
            map: map,
            position: moveLatLon
        });

        const infowindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;color:#BB86FC;text-align:center;">${place_name}</div>`,
            removable: true
        });
        infowindow.open(map, marker);
    };

    return (
        <div className='map_wrap'>
        <div className='map_outLineBox'>
            <div className='map_content' style={{ position: 'relative' }}>
                
                <div className='map_search_container'>
                    <div className='search_box'>
                        <input 
                            type="text" 
                            value={keyword} 
                            onChange={(e) => setKeyword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
                            placeholder="어디로 갈까요?"
                        />
                        <button onClick={searchPlaces}>검색</button>
                    </div>

                    {places.length > 0 && (
                        <ul className='search_results'>
                            {places.slice(0, 5).map((place, i) => (
                                <li key={i} onClick={() => moveSubLocation(place)}>
                                    <strong>{place.place_name}</strong>
                                    <span>{place.address_name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div id="map"></div>
            </div>
        </div>
    </div>
    );
}

export default Map;