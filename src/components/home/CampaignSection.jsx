import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  departmentChanged,
  queryChanged,
} from "../../features/products/productsSlice";
import EditorialImage from "./EditorialImage";
import Reveal from "../ui/Reveal";
import { ArrowRightIcon } from "../Icons";

const IMAGE =
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1600&q=80&auto=format&fit=crop";

/**
 * Full-bleed split campaign band.
 *
 * The photograph runs edge-to-edge on its half with no container padding —
 * that break from the page's shell margin is what makes it read as a campaign
 * rather than another card. Copy sits on the ink field opposite.
 *
 * It promotes a department, not a discount: there's no seasonal sale in the
 * data, so "40% OFF" would be a number invented for the sake of a red badge.
 */
export default function CampaignSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function shopWomen() {
    dispatch(queryChanged(""));
    dispatch(departmentChanged("women"));
    navigate("/products");
  }

  return (
    <section className="border-y border-line" aria-labelledby="campaign-heading">
      <div className="grid lg:grid-cols-2">
        {/* --- photograph --- */}
        <EditorialImage
          src={IMAGE}
          alt="A rail of neutral-toned garments hanging against a white wall"
          ratio="4/3"
          position="center"
          className="!rounded-none lg:h-full lg:aspect-auto lg:min-h-[38rem]"
        />

        {/* --- copy --- */}
        <div className="on-ink flex items-center">
          <Reveal className="w-full px-6 py-16 sm:px-12 lg:px-16 xl:px-24 lg:py-24">
            <p className="eyebrow flex items-center gap-3">
              <span className="h-px w-8 bg-[#ec3013]" aria-hidden="true" />
              The edit
            </p>

            <h2 id="campaign-heading" className="t-display mt-6 text-[#f4efe6] text-balance">
              New season
              <br />
              essentials.
            </h2>

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-[#f4efe6]/70">
              Dresses, shoes, bags and the small things that finish them.
              Everything in the women's edit, in one place, without the noise.
            </p>

            <button type="button" onClick={shopWomen} className="btn btn-secondary btn-lg mt-10">
              Shop the edit
              <ArrowRightIcon width={15} height={15} className="arrow" />
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
