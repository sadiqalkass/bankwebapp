//importent to know
"use client";
import CountUp from "react-countup";

const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <span className="w-full">
      <CountUp 
        decimal="," 
        prefix="$" 
        decimals={2}
        end={amount} 
      />
    </span>
  );
};

export default AnimatedCounter;
