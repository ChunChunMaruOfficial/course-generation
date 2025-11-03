import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = () => (
  <ContentLoader style={{
    scale: 1.915,
    top: '255px',
    left: '50%',
    transform: 'translateX(-26%)',
    position: 'absolute'
  }}
    speed={2}
    width={600}
    height={550}
    viewBox="0 0 600 550"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <rect x="410" y="55" rx="3" ry="3" width="144" height="11" />
    <rect x="410" y="87" rx="3" ry="3" width="79" height="10" />
    <rect x="410" y="71" rx="3" ry="3" width="81" height="11" />
    <rect x="412" y="110" rx="3" ry="3" width="157" height="18" />
    <rect x="24" y="52" rx="3" ry="3" width="217" height="17" />
    <rect x="58" y="92" rx="3" ry="3" width="190" height="15" />
    <rect x="59" y="133" rx="3" ry="3" width="103" height="15" />
    <rect x="58" y="175" rx="3" ry="3" width="236" height="15" />
    <rect x="57" y="220" rx="3" ry="3" width="190" height="15" />
    <circle cx="43" cy="99" r="9" />
    <circle cx="44" cy="141" r="9" />
    <circle cx="43" cy="183" r="9" />
    <circle cx="43" cy="227" r="9" />
    <rect x="411" y="160" rx="10" ry="10" width="161" height="44" />
    <rect x="411" y="212" rx="10" ry="10" width="161" height="44" />
    <rect x="412" y="263" rx="10" ry="10" width="161" height="44" />
  </ContentLoader>
)

export default MyLoader
