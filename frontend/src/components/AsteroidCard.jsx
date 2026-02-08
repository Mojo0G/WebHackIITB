import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Ruler, ArrowRight, Globe2 } from 'lucide-react';

const AsteroidCard = ({ asteroid }) => {
  const navigate = useNavigate();
  // Destructure the new 'image' property here
  const { name, id, riskColor, riskScore, estimated_diameter, image } = asteroid;
  
  const diameter = Math.round(
    (estimated_diameter.meters.estimated_diameter_min + 
     estimated_diameter.meters.estimated_diameter_max) / 2
  );

  const isHazardous = riskScore > 50;
  const borderColor = isHazardous ? 'border-red-500/40' : 'border-cyan-400/30';
  const shadowClass = isHazardous ? 'hover:shadow-[0_0_30px_rgba(239,68,68,0.4)]' : 'hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]';
  
  return (
    <div 
      onClick={() => navigate(`/asteroid/${id}`)}
      className={`
        group relative rounded-2xl overflow-hidden cursor-pointer 
        backdrop-blur-xl bg-slate-900/80 border ${borderColor} ${shadowClass}
        transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]
      `}
    >
      <div className="h-44 relative overflow-hidden bg-black/50">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
        
        <div className="absolute top-3 right-3 z-20">
           <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-xl border border-white/10 shadow-lg bg-black/40">
             <span className="relative flex h-2.5 w-2.5">
               {isHazardous && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: riskColor }}></span>}
               <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: riskColor }}></span>
             </span>
             <span className="font-sans font-bold text-xs tracking-wider text-white">RISK {riskScore}</span>
           </div>
        </div>

        {/* UPDATED: Uses the passed image prop */}
       <img 
  src={image} // <--- This will now use the image passed from Dashboard
  alt="Asteroid" 
  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition duration-700"
/>
      </div>

      <div className="p-5 relative z-20 -mt-6">
        <div className="mb-4">
           <h3 className="text-xl font-bold text-white truncate drop-shadow-sm group-hover:text-cyan-400 transition">
             {name.replace(/[()]/g, '')}
           </h3>
           <p className="text-purple-300/80 text-[10px] font-mono tracking-widest flex items-center gap-1">
             <Globe2 size={10} /> ID: {id}
           </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs bg-black/20 p-3 rounded-xl border border-white/5 backdrop-blur-md">
          <div className="flex flex-col">
            <span className="text-gray-400 mb-1 uppercase tracking-wider text-[9px]">Diameter</span>
            <div className="flex items-center gap-1 font-bold text-white">
              <Ruler size={12} className="text-cyan-400" /> {diameter}m
            </div>
          </div>
          
          <div className="flex flex-col items-end">
             <span className="text-gray-400 mb-1 uppercase tracking-wider text-[9px]">Status</span>
            <div className={`flex items-center gap-1 font-bold ${isHazardous ? 'text-red-400' : 'text-green-400'}`}>
              <Activity size={12} />
              {isHazardous ? 'DANGER' : 'STABLE'}
            </div>
          </div>
        </div>

        <div className={`mt-4 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-all ${isHazardous ? 'text-red-400' : 'text-cyan-400'}`}>
          View Trajectory <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
        </div>
      </div>
    </div>
  );
};

export default AsteroidCard;