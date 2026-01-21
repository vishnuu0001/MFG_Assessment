import pandas as pd
from database import SessionLocal, init_db, Area, Dimension, MaturityLevel, RatingScale
from datetime import datetime

def load_seed_data():
    """Load seed data from Excel file"""
    init_db()
    db = SessionLocal()
    
    try:
        # Clear existing data
        db.query(Dimension).delete()
        db.query(Area).delete()
        db.query(MaturityLevel).delete()
        db.query(RatingScale).delete()
        db.commit()
        
        # Create Areas from Reports sheet
        areas_data = [
            {"name": "Press Shop", "description": "Press Shop Digital Maturity", "desired_level": 4},
            {"name": "Assembly Area", "description": "Assembly Area Digital Maturity", "desired_level": 3},
            {"name": "Machine Shop 1", "description": "Machine Shop 1 Digital Maturity", "desired_level": 3}
        ]
        
        area_objects = {}
        for area_data in areas_data:
            area = Area(**area_data)
            db.add(area)
            db.flush()
            area_objects[area_data["name"]] = area
        
        # Dimensions for Press Shop
        press_shop_dimensions = [
            {"name": "Asset connectivity & OEE", "current_level": 3, "desired_level": 4},
            {"name": "MES & system integration", "current_level": 3, "desired_level": 4},
            {"name": "Traceability & quality", "current_level": 2, "desired_level": 4},
            {"name": "Maintenance & reliability", "current_level": 3, "desired_level": 4},
            {"name": "Logistics & supply chain", "current_level": 2, "desired_level": 4},
            {"name": "Workforce & UX", "current_level": 2, "desired_level": 4},
            {"name": "Sustainability & energy", "current_level": 3, "desired_level": 4},
            {"name": "Multi-plant orchestration", "current_level": 2, "desired_level": 4},
            {"name": "Cyber Security and Data Governance", "current_level": 3, "desired_level": 4},
            {"name": "Utility Areas", "current_level": 2, "desired_level": 4},
            {"name": "Inbound and Outbound Supply Chain", "current_level": 3, "desired_level": 4}
        ]
        
        for dim_data in press_shop_dimensions:
            dimension = Dimension(**dim_data, area_id=area_objects["Press Shop"].id)
            db.add(dimension)
        
        # Dimensions for Assembly Area
        assembly_dimensions = [
            {"name": "Asset connectivity & OEE", "current_level": 2, "desired_level": 3},
            {"name": "MES & system integration", "current_level": 2, "desired_level": 3},
            {"name": "Traceability & quality", "current_level": 3, "desired_level": 4},
            {"name": "Maintenance & reliability", "current_level": 2, "desired_level": 3},
            {"name": "Logistics & supply chain", "current_level": 3, "desired_level": 4},
            {"name": "Workforce & UX", "current_level": 2, "desired_level": 3},
            {"name": "Sustainability & energy", "current_level": 2, "desired_level": 3},
            {"name": "Multi-plant orchestration", "current_level": 2, "desired_level": 3}
        ]
        
        for dim_data in assembly_dimensions:
            dimension = Dimension(**dim_data, area_id=area_objects["Assembly Area"].id)
            db.add(dimension)
        
        # Dimensions for Machine Shop 1
        machine_shop_dimensions = [
            {"name": "Asset connectivity & OEE", "current_level": 2, "desired_level": 3},
            {"name": "MES & system integration", "current_level": 2, "desired_level": 3},
            {"name": "Traceability & quality", "current_level": 2, "desired_level": 3},
            {"name": "Maintenance & reliability", "current_level": 3, "desired_level": 4},
            {"name": "Logistics & supply chain", "current_level": 2, "desired_level": 3},
            {"name": "Workforce & UX", "current_level": 2, "desired_level": 3},
            {"name": "Sustainability & energy", "current_level": 2, "desired_level": 3},
            {"name": "Multi-plant orchestration", "current_level": 2, "desired_level": 3}
        ]
        
        for dim_data in machine_shop_dimensions:
            dimension = Dimension(**dim_data, area_id=area_objects["Machine Shop 1"].id)
            db.add(dimension)
        
        # Add Maturity Levels
        maturity_levels_data = [
            # Level 1
            {"level": 1, "sub_level": "1.1", "category": "Instrumented Assets & Lines", "name": "Connected & Visible", "description": "Machines, robots, and utilities fitted with sensors and PLC connectivity"},
            {"level": 1, "sub_level": "1.1a", "category": "Instrumented Assets & Lines", "name": "Connected & Visible", "description": "Machines, robots, and utilities fitted with sensors and PLC connectivity, capturing cycle times, stoppages, energy, and key process parameters."},
            {"level": 1, "sub_level": "1.1b", "category": "Instrumented Assets & Lines", "name": "Connected & Visible", "description": "Digital andon / OEE dashboards at cell, line, and shop level with near real-time KPIs (availability, performance, quality, safety)."},
            {"level": 1, "sub_level": "1.2", "category": "Basic Digital Material and Quality Tracking", "name": "Connected & Visible", "description": "Digital material and quality tracking"},
            {"level": 1, "sub_level": "1.2a", "category": "Basic Digital Material and Quality Tracking", "name": "Connected & Visible", "description": "Barcode/RFID for parts, containers, and racks in body, paint, and GA for basic traceability and error-proofing."},
            {"level": 1, "sub_level": "1.2b", "category": "Basic Digital Material and Quality Tracking", "name": "Connected & Visible", "description": "Digital NC logging and defect cataloging for welds, paint, torque, fit-and-finish, and EOL tests instead of paper."},
            
            # Level 2
            {"level": 2, "sub_level": "2.1", "category": "End-to-end system integration", "name": "Integrated & Data-Driven", "description": "End-to-end system integration"},
            {"level": 2, "sub_level": "2.1a", "category": "End-to-end system integration", "name": "Integrated & Data-Driven", "description": "MES integrated with ERP, PLM, WMS, QMS and maintenance systems so orders, BOM, process plans, and quality data flow seamlessly."},
            {"level": 2, "sub_level": "2.1b", "category": "End-to-end system integration", "name": "Integrated & Data-Driven", "description": "Vertical integration from shop-floor devices (IIoT platform) up to plant and corporate Manufacturing 360 or similar ops cockpit."},
            {"level": 2, "sub_level": "2.2", "category": "Closed-loop production control basics", "name": "Integrated & Data-Driven", "description": "Closed-loop production control"},
            {"level": 2, "sub_level": "2.2a", "category": "Closed-loop production control basics", "name": "Integrated & Data-Driven", "description": "Real-time line balance, bottleneck identification, and constraint-based sequencing (e.g., color, powertrain, options) with JIT/JIS support."},
            {"level": 2, "sub_level": "2.2b", "category": "Closed-loop production control basics", "name": "Integrated & Data-Driven", "description": "Electronic work instructions, poka-yoke checks, and torque/weld parameter validation triggered by VIN or work order."},
            {"level": 2, "sub_level": "2.3", "category": "Standardized data & analytics foundation", "name": "Integrated & Data-Driven", "description": "Standardized data and analytics"},
            {"level": 2, "sub_level": "2.3a", "category": "Standardized data & analytics foundation", "name": "Integrated & Data-Driven", "description": "Common data models for machines, products, defects, and maintenance events, enabling cross-line and cross-plant analytics."},
            {"level": 2, "sub_level": "2.3b", "category": "Standardized data & analytics foundation", "name": "Integrated & Data-Driven", "description": "Historical data lake or analytics platform for OEE, scrap, rework, test results, and downtime Pareto with self-service BI."},
            
            # Level 3
            {"level": 3, "sub_level": "3.1", "category": "Predictive maintenance & asset intelligence", "name": "Predictive & Optimized", "description": "Predictive maintenance"},
            {"level": 3, "sub_level": "3.1a", "category": "Predictive maintenance & asset intelligence", "name": "Predictive & Optimized", "description": "ML models on press shops, paint shops, body lines, and critical robots predicting failures before breakdown, with automated work orders."},
            {"level": 3, "sub_level": "3.1b", "category": "Predictive maintenance & asset intelligence", "name": "Predictive & Optimized", "description": "Health indices for robots, conveyors, AGVs, ovens, and utilities with spare-part risk visibility and maintenance impact on capacity."},
            {"level": 3, "sub_level": "3.2", "category": "Advanced quality analytics & zero-defect focus", "name": "Predictive & Optimized", "description": "Advanced quality analytics"},
            {"level": 3, "sub_level": "3.2a", "category": "Advanced quality analytics & zero-defect focus", "name": "Predictive & Optimized", "description": "Real-time anomaly detection on weld nuggets, torque curves, paint thickness, NVH, and EOL test traces to prevent escapes."},
            {"level": 3, "sub_level": "3.2b", "category": "Advanced quality analytics & zero-defect focus", "name": "Predictive & Optimized", "description": "Full digital traceability from VIN to every critical parameter, tool, and operator; analytics to reduce warranty and recall risk."},
            {"level": 3, "sub_level": "3.3", "category": "Flexible, high-mix line optimization", "name": "Predictive & Optimized", "description": "Flexible line optimization"},
            {"level": 3, "sub_level": "3.3a", "category": "Flexible, high-mix line optimization", "name": "Predictive & Optimized", "description": "Dynamic scheduling and smart conveyance enabling frequent changeovers across ICE/EV, trims, and option packs with minimal retooling."},
            {"level": 3, "sub_level": "3.3b", "category": "Flexible, high-mix line optimization", "name": "Predictive & Optimized", "description": "Simulation-based what-if for cycle time, staffing, and model mix changes to protect takt and labor efficiency."},
            
            # Level 4
            {"level": 4, "sub_level": "4.1", "category": "True mixed-model, sequence-robust lines", "name": "Flexible, Agile Factory", "description": "Mixed-model production"},
            {"level": 4, "sub_level": "4.1a", "category": "True mixed-model, sequence-robust lines", "name": "Flexible, Agile Factory", "description": "Ability to run different vehicle types (SUV, hatch, coupe, EV, variants) one after another on the same line, with automatic adaptation of tools, recipes, and logistics for each VIN in seconds."},
            {"level": 4, "sub_level": "4.1b", "category": "True mixed-model, sequence-robust lines", "name": "Flexible, Agile Factory", "description": "TecLines / modular cells and programmable conveyors that can be reconfigured with software changes rather than heavy mechanical rework."},
            {"level": 4, "sub_level": "4.2", "category": "Digital twins & virtualization", "name": "Flexible, Agile Factory", "description": "Digital twins"},
            {"level": 4, "sub_level": "4.2a", "category": "Digital twins & virtualization", "name": "Flexible, Agile Factory", "description": "Plant and line-level digital twins used for virtual commissioning, layout and flow optimization, and model introduction validation before physical change."},
            {"level": 4, "sub_level": "4.2b", "category": "Digital twins & virtualization", "name": "Flexible, Agile Factory", "description": "VR/AR-enabled planning and operator training, with scenarios for new model launch, process changes, and ergonomics."},
            {"level": 4, "sub_level": "4.3", "category": "Autonomous intralogistics & smart warehouse", "name": "Flexible, Agile Factory", "description": "Autonomous logistics"},
            {"level": 4, "sub_level": "4.3a", "category": "Autonomous intralogistics & smart warehouse", "name": "Flexible, Agile Factory", "description": "Integrated AGVs/AMRs, driverless floor conveyors, and autonomous ground vehicles orchestrated by WMS/MES and real-time demand."},
            {"level": 4, "sub_level": "4.3b", "category": "Autonomous intralogistics & smart warehouse", "name": "Flexible, Agile Factory", "description": "JIT/JIS supplier park integration with dock scheduling, yard management, and container-level tracking tied to production sequence."},
            
            # Level 5
            {"level": 5, "sub_level": "5.1", "category": "Self-optimizing production & AI co-pilots", "name": "Autonomous SDF", "description": "Self-optimizing production"},
            {"level": 5, "sub_level": "5.1a", "category": "Self-optimizing production & AI co-pilots", "name": "Autonomous SDF", "description": "AI agents that continuously adjust speeds, buffer sizes, maintenance windows, and staffing based on demand, constraints, and risk signals."},
            {"level": 5, "sub_level": "5.1b", "category": "Self-optimizing production & AI co-pilots", "name": "Autonomous SDF", "description": "Nerve-center / operations room spanning multiple plants with unified digital KPIs, scenario simulation, and cross-plant load balancing."},
            {"level": 5, "sub_level": "5.2", "category": "Green, resilient smart factory", "name": "Autonomous SDF", "description": "Green factory"},
            {"level": 5, "sub_level": "5.2a", "category": "Green, resilient smart factory", "name": "Autonomous SDF", "description": "Integrated energy and carbon management optimizing ovens, compressors, HVAC, and paint shop loads with PV, storage, and demand-response strategies."},
            {"level": 5, "sub_level": "5.2b", "category": "Green, resilient smart factory", "name": "Autonomous SDF", "description": "Resilience features: supply risk sensing, alternate routing, rapid reconfiguration to handle shortages (e.g., semiconductors, battery cells) and disruptions."},
            {"level": 5, "sub_level": "5.3", "category": "Human-centric, software-defined factory", "name": "Autonomous SDF", "description": "Human-centric SDF"},
            {"level": 5, "sub_level": "5.3a", "category": "Human-centric, software-defined factory", "name": "Autonomous SDF", "description": "Software-defined processes where adding a new variant or model is primarily a software/config exercise across MES, PLCs, logistics, and quality rules."},
            {"level": 5, "sub_level": "5.3b", "category": "Human-centric, software-defined factory", "name": "Autonomous SDF", "description": "Digital workforce tools: role-based mobile apps, AR assist for complex tasks, and AI copilots for engineers, planners, and maintenance teams."}
        ]
        
        for ml_data in maturity_levels_data:
            maturity_level = MaturityLevel(**ml_data)
            db.add(maturity_level)
        
        # Add Rating Scales
        dimensions_list = [
            "Asset Connectivity and OEE",
            "MES & System Integration",
            "Traceability and Quality",
            "Maintenance and Reliability",
            "Logistics and Supply Chain",
            "Workforce and User Experience",
            "Sustainability & Energy",
            "Multi-Plant Orchestration",
            "Cyber Security and Data Governance",
            "Utility Areas"
        ]
        
        rating_scales_data = []
        
        # Level 1 descriptions
        level_1_descriptions = {
            "Asset Connectivity and OEE": "Assets connected at machine level only; manual OEE tracking; limited visibility",
            "MES & System Integration": "MES absent or minimal; shop-floor data captured manually; systems operate in silos with no integration",
            "Traceability and Quality": "Manual logs for production and quality; limited traceability; paper-based compliance",
            "Maintenance and Reliability": "Maintenance performed only after breakdowns; manual logs; high unplanned downtime",
            "Logistics and Supply Chain": "Paper-based logistics, siloed visibility, reactive planning",
            "Workforce and User Experience": "Paper-based scheduling, basic HMI",
            "Sustainability & Energy": "Manual energy logs, limited reporting",
            "Multi-Plant Orchestration": "Independent sites, manual HQ reporting",
            "Cyber Security and Data Governance": "Antivirus and firewalls at device level; manual access controls; limited awareness of cyber risks",
            "Utility Areas": "Basic metering of utilities (electricity, water, compressed air); manual logs; siloed visibility"
        }
        
        for dim_name, desc in level_1_descriptions.items():
            rating_scales_data.append({
                "dimension_name": dim_name,
                "level": 1,
                "rating_name": f"1 – Basic Level",
                "digital_maturity_description": desc,
                "business_relevance": "Tactical: Improves transparency and reduces manual reporting errors; supports basic productivity gains"
            })
        
        # Level 2 descriptions
        level_2_descriptions = {
            "Asset Connectivity and OEE": "Assets connected to SCADA/HMI; automated OEE capture; siloed data repositories",
            "MES & System Integration": "MES deployed at line level; limited integration with ERP/SCADA; basic production reporting automated",
            "Traceability and Quality": "Digital records of production batches; basic barcode/RFID tracking; siloed quality systems",
            "Maintenance and Reliability": "Scheduled maintenance based on time/usage; basic CMMS; reduced breakdowns but not optimized",
            "Logistics and Supply Chain": "Barcode/RFID tracking, basic WMS/TMS integration",
            "Workforce and User Experience": "Role-based dashboards, digital work instructions",
            "Sustainability & Energy": "Automated metering, siloed dashboards",
            "Multi-Plant Orchestration": "Centralized dashboards, siloed aggregation",
            "Cyber Security and Data Governance": "Defined IT/OT security policies; role-based access; patch management; siloed monitoring systems",
            "Utility Areas": "Automated utility monitoring integrated with MES/ERP; centralized dashboards for consumption and cost tracking"
        }
        
        for dim_name, desc in level_2_descriptions.items():
            rating_scales_data.append({
                "dimension_name": dim_name,
                "level": 2,
                "rating_name": f"2 – Intermediate Level",
                "digital_maturity_description": desc,
                "business_relevance": "Strategic: Enables better planning, scheduling, and resource utilization; supports cross-departmental decisions"
            })
        
        # Level 3-5 similar pattern...
        level_3_descriptions = {
            "Asset Connectivity and OEE": "OEE data integrated with MES/ERP; standardized KPIs; historical trend analysis",
            "MES & System Integration": "MES integrated with ERP, PLM, and shop-floor controls; standardized workflows; centralized data repository",
            "Traceability and Quality": "MES integrated with quality systems; end-to-end product genealogy; standardized defect tracking",
            "Maintenance and Reliability": "Sensors monitor asset health; maintenance triggered by condition thresholds; integration with MES/ERP for planning",
            "Logistics and Supply Chain": "MES–ERP–SCM integration, real-time inventory visibility",
            "Workforce and User Experience": "MES/ERP integration, mobile access, standardized UX",
            "Sustainability & Energy": "MES/ERP integration, standardized KPIs",
            "Multi-Plant Orchestration": "MES/ERP integration across sites, standardized KPIs",
            "Cyber Security and Data Governance": "Centralized monitoring (SIEM); MES/ERP integrated with security protocols; standardized data governance policies",
            "Utility Areas": "Predictive analytics for utility demand; optimization of energy/water/air usage; anomaly detection for leaks or inefficiencies"
        }
        
        for dim_name, desc in level_3_descriptions.items():
            rating_scales_data.append({
                "dimension_name": dim_name,
                "level": 3,
                "rating_name": f"3 – Advanced Level",
                "digital_maturity_description": desc,
                "business_relevance": "Transformational: Drives enterprise-wide efficiency, predictive asset management, and new business models"
            })
        
        for rs_data in rating_scales_data:
            rating_scale = RatingScale(**rs_data)
            db.add(rating_scale)
        
        db.commit()
        print("✓ Seed data loaded successfully!")
        
    except Exception as e:
        print(f"Error loading seed data: {e}")
        db.rollback()
        raise
    finally:
        db.close()

if __name__ == "__main__":
    load_seed_data()
