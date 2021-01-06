import React from "react";
import star from "../assets/icons/star.png";

export default function Rating({ value, height }) {
  let starElements = [];
  for (let i = 0; i < value; i++) {
    starElements.push(<img className={`transform rotate-12 translate-y-1 h-${height} w-${height}`} key={i} src={star} alt="star" />);
  }

  return <div className="flex flex-row flex-nowrap h-4 items-center mr-2">{starElements}</div>;
}

// const StarContainer = styled.div`
//   display: flex;
//   flex-flow: row nowrap;
//   height: ${(props) => props.height};
// `;

// const StarImage = styled.img`
//   height: 100%;
//   width: auto;
//   transform: rotate(-30deg);
//   filter: invert(100%);
// `;
