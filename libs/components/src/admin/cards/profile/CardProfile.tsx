import clsx from 'clsx'

import RightSidebar from '../../sidebars/right/RightSidebar'
import CardProfileStat from './CardProfileStat'

export default function CardProfile() {
  return (
    <RightSidebar>
      <div className="flex flex-wrap justify-center">
        <div className="w-full px-4 flex justify-center">
          <div className="relative">
            <img
              alt="..."
              src="https://demos.creative-tim.com/notus-nextjs/img/team-2-800x800.jpg"
              className={clsx(
                'shadow-xl',
                'rounded-full',
                'h-auto',
                'align-middle',
                'border-none',
                'absolute',
                '-m-16',
                '-ml-20',
                'lg:-ml-16',
                'max-w-150-px'
              )}
            />
          </div>
        </div>
        <div className="w-full px-4 text-center mt-20">
          <div className="flex justify-center py-4 lg:pt-4 pt-8">
            <CardProfileStat name="Stories" value="10" />
            <CardProfileStat name="Friends" value="22" />
            <CardProfileStat name="Comments" value="89" />
          </div>
        </div>
      </div>

      <div className="text-center mt-12">
        <h3 className="text-xl font-semibold leading-normal mb-2 text-blueGray-700">
          Jenna Stones
        </h3>
        <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold uppercase">
          <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"></i>{' '}
          Los Angeles, California
        </div>
        <div className="mb-2 text-blueGray-600 mt-10">
          <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>
          Solution Manager - Creative Tim Officer
        </div>
        <div className="mb-2 text-blueGray-600">
          <i className="fas fa-university mr-2 text-lg text-blueGray-400"></i>
          University of Computer Science
        </div>
      </div>

      <div className="mt-10 py-10 border-t border-blueGray-200 text-center">
        <div className="flex flex-wrap justify-center">
          <div className="w-full lg:w-9/12 px-4">
            <p className="mb-4 text-lg leading-relaxed text-blueGray-700">
              An artist of considerable range, Jenna the name taken by
              Melbourne-raised, Brooklyn-based Nick Murphy writes, performs and
              records all of his own music, giving it a warm, intimate feel with
              a solid groove structure. An artist of considerable range.
            </p>
            <a
              href="#pablo"
              className="font-normal text-lightBlue-500"
              onClick={(e) => e.preventDefault()}
            >
              Show more
            </a>
          </div>
        </div>
      </div>
    </RightSidebar>
  )
}
