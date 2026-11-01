import { CloudShader } from './ui/cloud-shader';

export default function CloudBackground() {
  return <div className="cloud-background" aria-hidden="true"><CloudShader className="cloud-field" speed={.45} count={6} cloudColor="#fff9f3" skyTopColor="#73b5ed" skyBottomColor="#c4e6fb" /><div className="cloud-wash" /></div>;
}
