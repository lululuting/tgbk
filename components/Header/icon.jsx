const WeatherIcon = (props) => {
  return (
    <span
      // xmlns="http://www.w3.org/2000/svg"
      style={{color: '#666', fontSize: props.size || 24, ...props.style}}
      className={`qi-${props.code}`}
    />
  );
};
export default WeatherIcon;
