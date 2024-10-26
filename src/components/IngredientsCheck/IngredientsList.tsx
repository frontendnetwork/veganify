import React from "react";

export function IngredientList({
  items,
  iconClass,
}: {
  items: string[];
  iconClass: string;
}) {
  return (
    <>
      {items.map((item) => (
        <div className="Grid" key={item}>
          <div className="Grid-cell description">
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </div>
          <div className="Grid-cell icons">
            <span className={iconClass}></span>
          </div>
        </div>
      ))}
    </>
  );
}
