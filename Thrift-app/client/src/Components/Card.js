
import './Card.css';
function Card({data}) {
    console.log(data)

    return (
        <div>
                    
                        <div>
                            <img src={`http://localhost:5000/${data.imageUrl}`} alt={data.name} className="card-image" key={data.id} />
                        </div>
                        <div className="card-content">
                            <h2 className="card-title">{data.name}</h2>
                            <p className="card-description">{data.description}</p>
                            <p className="card-price">{data.price}</p>
                        </div>
                
               
            
        </div>


    )
}

export default Card;
import 'Thrift-app\client\src\components\Card.css';