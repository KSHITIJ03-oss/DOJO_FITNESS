// import React from 'react';

// const PlanCard = ({ plan, onEdit, onDelete, role }) => {
//   const {
//     id,
//     name,
//     description,
//     duration_days,
//     price,
//     discount,
//     final_price,
//     features,
//     image_url,
//     is_active,
//   } = plan || {};

//   const displayImage = '/images/image.png';

//   return (
//     <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-shadow relative">
//       <div className="h-40 bg-cover bg-center" style={{ backgroundImage: `url(${displayImage})` }} />

//       <div className="p-4">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="text-lg font-semibold text-white">{name}</h3>
//             <p className="text-sm text-gray-400 truncate">{description}</p>
//           </div>
//           <div className="text-right">
//             <div className="text-sm text-gray-400">{duration_days} days</div>
//             <div className="mt-2">
//               {price && discount ? (
//                 <div className="flex items-baseline space-x-2">
//                   <div className="text-sm text-gray-400 line-through"> ₹{price}</div>
//                   <div className="text-white font-bold">₹{final_price ?? price}</div>
//                 </div>
//               ) : (
//                 <div className="text-white font-bold">₹{final_price ?? price ?? '—'}</div>
//               )}
//             </div>
//           </div>
//         </div>

//         {features && features.length > 0 && (
//           <ul className="mt-3 text-sm text-gray-300 space-y-1">
//             {features.slice(0, 4).map((f, idx) => (
//               <li key={idx}>• {f}</li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="flex items-center justify-between p-3 border-t border-gray-700 bg-gray-900/60">
//         <div className="text-xs text-gray-400">{is_active ? 'Active' : 'Inactive'}</div>

//         <div className="flex items-center space-x-2">
//           {role === 'admin' ? (
//             <>
//               <button
//                 onClick={() => onEdit(plan)}
//                 className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => onDelete(id)}
//                 className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded"
//               >
//                 Delete
//               </button>
//             </>
//           ) : (
//             <a href="#" className="text-sm text-primary-400 hover:underline">
//               Learn More
//             </a>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PlanCard;

import React from 'react';

const PlanCard = ({ plan, onEdit, onDelete, role }) => {
  const {
    id,
    name,
    description,
    duration_days,
    price,
    discount,
    final_price,
    features,
    image_url,
    is_active,
  } = plan || {};

  const displayImage = image_url || '/images/image.png';

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-primary-500 transition-shadow relative">

      {/* IMAGE SECTION */}
      <div
        className="relative h-56 bg-cover bg-center"
        style={{ backgroundImage: `url(${displayImage})` }}
      >
        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        {/* TEXT OVER IMAGE */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white">{name}</h3>
              <p className="text-sm text-gray-300">{description}</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-2 py-0.5 text-xs bg-black/50 text-white rounded">
                {duration_days} days
              </span>

              <div className="mt-2">
                {price && discount ? (
                  <div className="flex items-baseline justify-end space-x-2">
                    <span className="text-sm text-gray-300 line-through">
                      ₹{price}
                    </span>
                    <span className="text-lg font-bold text-white">
                      ₹{final_price}
                    </span>
                  </div>
                ) : (
                  <span className="text-lg font-bold text-white">
                    ₹{final_price ?? price ?? '—'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      {features && features.length > 0 && (
        <div className="p-4">
          <ul className="text-sm text-gray-300 space-y-1">
            {features.slice(0, 4).map((f, idx) => (
              <li key={idx}>• {f}</li>
            ))}
          </ul>
        </div>
      )}

      {/* FOOTER ACTIONS */}
      <div className="flex items-center justify-between p-3 border-t border-gray-700 bg-gray-900/60">
        <span className="text-xs text-gray-400">
          {is_active ? 'Active' : 'Inactive'}
        </span>

        <div className="flex items-center space-x-2">
          {role === 'admin' ? (
            <>
              <button
                onClick={() => onEdit(plan)}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(id)}
                className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white text-sm rounded"
              >
                Delete
              </button>
            </>
          ) : (
            <span className="text-sm text-primary-400 hover:underline cursor-pointer">
              {/* Learn More → */}
            </span>
          )
          }
        </div>
      </div>
    </div>
  );
};

export default PlanCard;
