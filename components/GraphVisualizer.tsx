import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, VisualState, GroupLegend } from '../types';

interface GraphVisualizerProps {
  data: GraphData;
  activeNodeIds: string[]; // Final union of seeds + traversed
  seedNodeIds: string[];
  traversedNodeIds: string[];
  visualState: VisualState;
  legend?: GroupLegend;
  onNodeClick?: (nodeId: string) => void;
}

const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ 
  data, 
  activeNodeIds, 
  seedNodeIds, 
  traversedNodeIds,
  visualState,
  legend,
  onNodeClick 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const simulationRef = useRef<d3.Simulation<d3.SimulationNodeDatum, undefined> | null>(null);

  // Helper to get consistent colors
  const getNodeColor = (group: number) => {
    // 0: Slate (Gray), 1: Blue, 2: Emerald (Green), 3: Violet (Purple), 4: Pink, 5: Red
    const colors = ["#64748b", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#ef4444"];
    return colors[group % colors.length];
  };

  // Handle Resize
  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        setDimensions({
          width: wrapperRef.current.clientWidth,
          height: wrapperRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize D3 Simulation
  useEffect(() => {
    if (!svgRef.current || !data.nodes || !data.nodes.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Zoom Group
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    svg.call(zoom);

    // Arrowhead
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 22)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .append('path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#64748b')
      .style('stroke', 'none');

    const nodes = data.nodes.map(d => ({ ...d }));
    const links = (data.links || []).map(d => ({ ...d }));

    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    simulationRef.current = simulation;

    // --- ELEMENTS ---
    const link = g.append("g")
      .attr("stroke", "#64748b")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrowhead)");

    // Label Halo (Background for text readability)
    const linkLabelHalo = g.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d: any) => d.label)
      .attr("font-size", 9)
      .attr("stroke", "#0d1117") // Dark background color
      .attr("stroke-width", 3)
      .attr("text-anchor", "middle")
      .style("opacity", 0.8)
      .attr("dy", -3);

    const linkLabel = g.append("g")
      .selectAll("text")
      .data(links)
      .join("text")
      .text((d: any) => d.label)
      .attr("font-size", 9)
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("dy", -3);

    const node = g.append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", (d: any) => d.val || 8)
      .attr("fill", "#1e293b") // Default Dark
      .attr("stroke", "#334155")
      .attr("stroke-width", 2)
      .attr("class", "node-circle") // Class for selection
      .call(drag(simulation) as any)
      .on("click", (event, d) => {
        if (onNodeClick) onNodeClick(d.id);
      });

    const labels = g.append("g")
      .selectAll("text")
      .data(nodes)
      .join("text")
      .text((d) => d.label)
      .attr("font-size", 11)
      .attr("font-weight", "500")
      .attr("fill", "#e2e8f0")
      .attr("dx", 14)
      .attr("dy", 4)
      .style("pointer-events", "none")
      .style("text-shadow", "0px 0px 3px #000");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabelHalo
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      linkLabel
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      labels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    });

    return () => {
      simulation.stop();
    };
  }, [data, dimensions]);

  // --- VISUALIZATION EFFECTS (Updates without re-simulating) ---
  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const nodes = svg.selectAll(".node-circle");

    if (visualState === 'idle') {
      nodes
        .transition().duration(500)
        .attr("fill", (d: any) => getNodeColor(d.group))
        .attr("stroke", "#0f172a")
        .attr("stroke-width", 2)
        .attr("r", (d: any) => d.val || 8)
        .style("opacity", 1);
    } 
    else if (visualState === 'scanning') {
      // Pulse effect: Randomly change opacity to simulate scanning
      const pulse = () => {
        if (visualState !== 'scanning') return;
        nodes.transition().duration(300)
          .style("opacity", () => 0.3 + Math.random() * 0.7)
          .on("end", pulse);
      };
      pulse();
    }
    else if (visualState === 'seeds') {
      // Highlight SEEDS only, dim others
      nodes.transition().duration(500)
        .style("opacity", (d: any) => seedNodeIds.includes(d.id) ? 1 : 0.2)
        .attr("fill", (d: any) => seedNodeIds.includes(d.id) ? "#3b82f6" : "#1e293b") // Blue for Seeds
        .attr("stroke", (d: any) => seedNodeIds.includes(d.id) ? "#60a5fa" : "#334155")
        .attr("stroke-width", (d: any) => seedNodeIds.includes(d.id) ? 4 : 1)
        .attr("r", (d: any) => seedNodeIds.includes(d.id) ? (d.val || 8) * 1.3 : (d.val || 8));
    }
    else if (visualState === 'traversing') {
      // Highlight SEEDS (Blue) + NEIGHBORS (Orange)
      nodes.transition().duration(500)
        .style("opacity", (d: any) => activeNodeIds.includes(d.id) ? 1 : 0.2)
        .attr("fill", (d: any) => {
           if (seedNodeIds.includes(d.id)) return "#3b82f6"; // Blue
           if (traversedNodeIds.includes(d.id)) return "#f59e0b"; // Orange
           return "#1e293b";
        })
        .attr("stroke", "#fff")
        .attr("stroke-width", (d: any) => activeNodeIds.includes(d.id) ? 3 : 1)
        .attr("r", (d: any) => activeNodeIds.includes(d.id) ? (d.val || 8) * 1.2 : (d.val || 8));
    }
    else if (visualState === 'complete') {
       // Final stable state
       nodes.transition().duration(500)
        .style("opacity", (d: any) => activeNodeIds.includes(d.id) ? 1 : 0.4)
        .attr("fill", (d: any) => activeNodeIds.includes(d.id) ? "#f59e0b" : getNodeColor(d.group))
        .attr("stroke", (d: any) => activeNodeIds.includes(d.id) ? "#fff" : "#0f172a")
        .attr("stroke-width", (d: any) => activeNodeIds.includes(d.id) ? 3 : 1);
    }

  }, [visualState, seedNodeIds, traversedNodeIds, activeNodeIds]);


  function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  }

  return (
    <div ref={wrapperRef} className="w-full h-full relative overflow-hidden bg-gray-950 rounded-lg shadow-inner border border-gray-800">
      <svg ref={svgRef} width="100%" height="100%" className="cursor-move" />
      
      {/* 1. Status Overlay (Bottom Left) */}
      <div className="absolute bottom-4 left-4 pointer-events-none">
         <div className="bg-gray-900/80 backdrop-blur text-xs p-3 rounded border border-gray-700">
            <h4 className="font-bold text-gray-300 mb-2">
              Status: <span className="text-blue-400 uppercase">{visualState}</span>
            </h4>
            <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-blue-500 border border-white"></span> Search Seed</div>
            <div className="flex items-center gap-2 mb-1"><span className="w-3 h-3 rounded-full bg-amber-500 border border-white"></span> Traversed Context</div>
            <div className="mt-2 border-t border-gray-700 pt-2 text-[10px] text-gray-500">
              {activeNodeIds.length > 0 ? `${activeNodeIds.length} Nodes Active` : "Idle"}
            </div>
         </div>
      </div>

      {/* 2. Legend Overlay (Top Right) */}
      {legend && (
        <div className="absolute top-4 right-4 pointer-events-none">
          <div className="bg-gray-900/90 backdrop-blur p-3 rounded border border-gray-700 shadow-xl max-w-[150px]">
             <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-2 border-b border-gray-800 pb-1">Entity Types</h4>
             <div className="space-y-1.5">
               {Object.entries(legend).map(([groupStr, label]) => {
                 const group = parseInt(groupStr);
                 return (
                   <div key={group} className="flex items-center gap-2">
                     <span 
                       className="w-2.5 h-2.5 rounded-full shadow-sm"
                       style={{ backgroundColor: getNodeColor(group) }}
                     ></span>
                     <span className="text-[10px] text-gray-300 leading-tight">{label}</span>
                   </div>
                 );
               })}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphVisualizer;