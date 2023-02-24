import config from './conf.json' assert { type: "json" };
import dateFormat from "dateformat";

export const projectsConfig = (version) =>
    Object.entries(config).map(([key, value]) => {
        const currentDate = dateFormat(new Date(), "yyyy_mm_dd");
        const projectName = `${key}_${currentDate}_${version}`
        const lambda = x => ({ ...x, projectId: projectName });
        return {
            name: projectName,
            indices: [...value.indices].map(lambda),
            extendedMappingMutations: [...value.extendedMappingMutations].map(lambda),
        };
    });
