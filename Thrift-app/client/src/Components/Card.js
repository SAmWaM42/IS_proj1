import './Card.css';
import { Link } from 'react-router-dom';

function Card({ data }) {
  const productUrl = `/product/${data._id}`;

  return (
    <div className="card">
      <div>
 <img
  src={`/${data.imageUrl}`}
  alt={data.name}
  className="card-image"
  onError={(e) => {
    e.target.onerror = null;
    e.target.src = '/images/default.png'; // A fallback image you place in public/images/
  }}
/>


      </div>
      <div className="card-content">
        <Link to={productUrl}>
          <h2 className="card-title">{data.name}</h2>
        </Link>
        <p className="card-description">{data.description}</p>
        <p className="card-price">{data.price}</p>
      </div>
    </div>
  );
}

export default Card;
