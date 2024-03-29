import GoogleMapReact from 'google-map-react';
import { useEffect, useState } from 'react';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export function UserLocation({ getUserLocation }) {

    const [coordinates, setCoordinates] = useState()
    const zoom = 13

    useEffect(() => {
        getPosition()
    }, [])

    function getPosition() {
        if (!navigator.geolocation) {
            alert('HTML5 Geolocation is not supported in your browser')
            return
        }
        navigator.geolocation.getCurrentPosition(showLocation, handleLocationError);
    }

    function showLocation(position) {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        getUserLocation({ lat, lng })
        setCoordinates({ lat, lng })
    }

    function handleLocationError(err) {
        console.log(err.message);
    }

    function onHandleClick({ lat, lng }) {
        setCoordinates({ lat, lng })
    }

    return (
        <div style={{ height: '150px', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyCju_hmhNCmyKS7cwa8YtAjNkO7ZPz4XmU" }}
                center={coordinates}
                defaultZoom={zoom}
                defaultCenter={{ lat: 32.0822, lng: 34.7818 }}
                onClick={onHandleClick}
            >
                <AnyReactComponent
                    {...coordinates}
                    text={<LocationOnIcon />}
                />
            </GoogleMapReact>
        </div>
    );
}